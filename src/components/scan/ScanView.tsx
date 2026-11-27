"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AlertTriangle, BadgeCheck, CircleHelp, HelpCircle, Image as ImageIcon, RotateCcw, ShieldCheck, SlidersHorizontal, X, Zap, ZapOff } from "lucide-react";
import { DEFAULT_SETTINGS, clampSettings, readSettings, subscribeSettings, writeSettings, type CaptureSettings } from "@/lib/scan/capture";
import { outcomeText, scanText as t } from "@/content/scan";

type ScanState = "idle" | "charging" | "capturing" | "analyzing";
type Verdict = { outcome: "genuine" | "fake" | "unverified"; serial: string | null; score: number | null; beads: number; matched: number };

/** 촬영 사진 한 변 크기(px) */
const FRAME_PX = 800;
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const roundBtn = "flex items-center justify-center rounded-full bg-white/12 text-white backdrop-blur hover:bg-white/22 disabled:opacity-40";

/**
 * 카메라 스캔 화면.
 * 촬영 버튼 한 번으로 [플래시 켜서 빛 충전 → 플래시 끄기 → 연속 촬영 → 서버 판별] 순서로 진행돼요.
 */
export function ScanView() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // 촬영 조건(실험용)은 이 기기에 기억해요.
  const settings = useSyncExternalStore(subscribeSettings, readSettings, () => DEFAULT_SETTINGS);
  const update = (patch: Partial<CaptureSettings>) => writeSettings(clampSettings({ ...settings, ...patch }));

  // 후면 카메라 켜기
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) return setHasCamera(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) return stream.getTracks().forEach((tr) => tr.stop());
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setHasCamera(true);
        // 플래시(손전등) 지원 여부. 일부 브라우저는 getCapabilities 가 없어서 지원 목록도 함께 봐요.
        const track = stream.getVideoTracks()[0];
        const caps = track?.getCapabilities?.() as (MediaTrackCapabilities & { torch?: boolean }) | undefined;
        const listed = (navigator.mediaDevices.getSupportedConstraints?.() as Record<string, boolean> | undefined)?.torch;
        setTorchSupported(Boolean(caps?.torch ?? listed));
      } catch {
        setHasCamera(false);
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  const setTorch = useCallback(async (on: boolean) => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return false;
    try {
      await track.applyConstraints({ advanced: [{ torch: on } as MediaTrackConstraintSet] });
      setTorchOn(on);
      return true;
    } catch {
      return false;
    }
  }, []);

  /** 사진 묶음을 서버로 보내 판별해요. */
  async function analyze(frames: Blob[], timestamps: number[]) {
    setState("analyzing");
    const form = new FormData();
    frames.forEach((b, i) => form.append("frames", b, `frame-${i}.jpg`));
    form.append("timestamps", JSON.stringify(timestamps));
    try {
      const res = await fetch("/api/scan", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      setVerdict((await res.json()) as Verdict);
    } catch {
      setError("판별에 실패했어요. 네트워크를 확인하고 다시 시도해 주세요.");
    }
    setState("idle");
  }

  async function capture() {
    if (state !== "idle") return;
    setError(null);
    const video = videoRef.current;
    if (!hasCamera || !video || video.videoWidth === 0) return setError(t.noCamera);
    setSettingsOpen(false);
    const used = settings;

    // 1) 플래시로 빛 충전 → 2) 끄기
    if (torchSupported) {
      setState("charging");
      if (await setTorch(true)) {
        await sleep(used.chargeMs);
        await setTorch(false);
      } else {
        // 지원한다고 했지만 실제로 켜지지 않는 기기예요. 이후에는 플래시 없이 안내해요.
        setTorchSupported(false);
      }
    }
    // 3) 가운데 사각형 부분만 잘라 일정 간격으로 연속 촬영
    setState("capturing");
    const side = Math.min(video.videoWidth, video.videoHeight) * 0.7;
    const sx = (video.videoWidth - side) / 2;
    const sy = (video.videoHeight - side) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = FRAME_PX;
    const ctx = canvas.getContext("2d");
    if (!ctx) return setState("idle");
    const frames: Blob[] = [];
    const timestamps: number[] = [];
    const t0 = performance.now();
    for (let i = 0; i < used.frameCount; i++) {
      const wait = t0 + i * used.frameIntervalMs - performance.now();
      if (wait > 0) await sleep(wait);
      ctx.drawImage(video, sx, sy, side, side, 0, 0, FRAME_PX, FRAME_PX);
      timestamps.push(Math.round(performance.now() - t0));
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
      if (blob) frames.push(blob);
      setProgress({ done: i + 1, total: used.frameCount });
    }
    setProgress(null);
    if (frames.length === 0) {
      setState("idle");
      return setError("사진을 찍지 못했어요. 다시 시도해 주세요.");
    }
    // 4) 판별
    analyze(frames, timestamps);
  }

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) analyze([file], [0]);
  }

  const busy = state !== "idle";
  const status =
    state === "charging" ? t.charging
      : state === "capturing" ? `${t.capturing} ${progress ? `${progress.done}/${progress.total}` : ""}`
        : state === "analyzing" ? t.analyzing
          : t.guide;
  const corner = `absolute h-10 w-10 border-sky-mid [border-width:3px] ${state === "charging" ? "border-white" : ""}`;

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-[radial-gradient(80%_60%_at_50%_40%,#17405f_0%,#0f2a3d_60%,#0b1f2e_100%)] text-white">
      {/* 카메라 화면 */}
      <video ref={videoRef} playsInline muted className={`absolute inset-0 h-full w-full object-cover ${hasCamera ? "opacity-100" : "opacity-0"}`} />
      {hasCamera && <div className="absolute inset-0 bg-[#0b1f2e]/30" />}
      {/* 충전 중에는 화면 가장자리가 하늘색으로 빛나요 */}
      {state === "charging" && <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_30px_rgba(125,211,252,0.45)]" />}

      {/* 상단 */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-4">
        <button type="button" aria-label="닫기" onClick={() => router.push("/")} className={`${roundBtn} h-11 w-11`}><X size={22} /></button>
        <span className="text-base font-semibold">{t.title}</span>
        <span className="flex gap-2">
          <button type="button" aria-label="촬영 조건" aria-expanded={settingsOpen} disabled={busy} onClick={() => setSettingsOpen((v) => !v)} className={`${roundBtn} h-11 w-11 ${settingsOpen ? "bg-white/30" : ""}`}>
            <SlidersHorizontal size={20} />
          </button>
          <Link href="/#how" aria-label="도움말" className={`${roundBtn} h-11 w-11`}><CircleHelp size={20} /></Link>
        </span>
      </header>

      {/* 촬영 조건 (실험용) */}
      {settingsOpen && (
        <div className="absolute inset-x-4 top-[76px] z-20 mx-auto flex max-w-[420px] flex-col gap-4 rounded-3xl bg-white p-5 text-ink shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="font-bold">촬영 조건</span>
            <button type="button" onClick={() => writeSettings(DEFAULT_SETTINGS)} className="text-sm font-semibold text-sub hover:text-ink">기본값</button>
          </div>
          <Slider label="플래시 충전 시간" value={`${(settings.chargeMs / 1000).toFixed(1)}초`} min={500} max={10000} step={100} current={settings.chargeMs} onChange={(v) => update({ chargeMs: v })} />
          <Slider label="촬영 장수" value={`${settings.frameCount}장`} min={2} max={30} step={1} current={settings.frameCount} onChange={(v) => update({ frameCount: v })} />
          <Slider label="촬영 간격" value={`${settings.frameIntervalMs}ms`} min={50} max={1000} step={50} current={settings.frameIntervalMs} onChange={(v) => update({ frameIntervalMs: v })} />
          <p className="text-xs text-muted">플래시를 끈 뒤 {(((settings.frameCount - 1) * settings.frameIntervalMs) / 1000).toFixed(1)}초 동안 촬영해요. 설정은 이 기기에 저장돼요.</p>
        </div>
      )}

      {/* 가운데: 안내 + 촬영 사각형 */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <div className="flex items-center gap-2 text-base font-semibold text-white/90" aria-live="polite">
          {busy && <span className={`h-2 w-2 animate-pulse rounded-full ${state === "charging" ? "bg-white" : "bg-sky-mid"}`} />}
          {status}
        </div>
        <div className="relative aspect-square w-[250px] sm:w-[300px]">
          <span className={`${corner} left-0 top-0 rounded-tl-2xl border-b-0 border-r-0`} />
          <span className={`${corner} right-0 top-0 rounded-tr-2xl border-b-0 border-l-0`} />
          <span className={`${corner} bottom-0 left-0 rounded-bl-2xl border-r-0 border-t-0`} />
          <span className={`${corner} bottom-0 right-0 rounded-br-2xl border-l-0 border-t-0`} />
          {state === "capturing" && progress && (
            <div className="absolute inset-x-6 bottom-6 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-sky-mid transition-[width] duration-150" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
            </div>
          )}
          {state === "analyzing" && <span className="motion-safe-anim absolute inset-x-3 h-0.5 animate-scan bg-gradient-to-r from-sky-mid/0 via-sky-mid to-sky-mid/0 shadow-[0_0_14px_3px_rgba(125,211,252,0.6)]" />}
        </div>
        <p className="min-h-10 max-w-[320px] text-center text-sm leading-relaxed text-white/70">
          {busy ? t.holdStill : error ?? (hasCamera === false ? t.noCamera : hasCamera && !torchSupported ? t.noTorch : `플래시 ${(settings.chargeMs / 1000).toFixed(1)}초 → 끈 뒤 ${settings.frameCount}장 연속 촬영`)}
        </p>
      </main>

      {/* 하단: 플래시 상태 · 촬영 버튼 · 갤러리 */}
      <footer className="relative z-10 flex flex-col items-center gap-5 px-8 pb-8">
        <div className="flex w-full max-w-[360px] items-center justify-between">
          <span role="status" aria-label={!torchSupported ? "플래시 사용 불가" : torchOn ? "플래시 켜짐" : "플래시 대기"}
            className={`flex h-14 w-14 items-center justify-center rounded-full ${!torchSupported ? "bg-white/10 text-white/40" : torchOn ? "bg-white text-sky-dark" : "bg-white/12 text-white"}`}>
            {torchSupported ? <Zap size={24} fill={torchOn ? "currentColor" : "none"} /> : <ZapOff size={24} />}
          </span>
          <button type="button" aria-label="촬영" onClick={capture} disabled={busy} className="flex h-20 w-20 rounded-full border-4 border-white p-1">
            <span className={`flex flex-1 items-center justify-center rounded-full ${busy ? "bg-sky" : "bg-white"}`}>
              {busy && <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-white/35 border-t-white" />}
            </span>
          </button>
          <button type="button" aria-label="갤러리에서 선택" onClick={() => fileRef.current?.click()} disabled={busy} className={`${roundBtn} h-14 w-14`}>
            <ImageIcon size={24} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/55"><ShieldCheck size={14} />{t.privacy}</div>
      </footer>

      {verdict && <ResultSheet verdict={verdict} onRetry={() => setVerdict(null)} />}
    </div>
  );
}

/** 판정 결과를 아래에서 올라오는 카드로 보여줘요. */
function ResultSheet({ verdict, onRetry }: { verdict: Verdict; onRetry: () => void }) {
  const o = outcomeText[verdict.outcome];
  const tone = {
    genuine: { Icon: BadgeCheck, chip: "bg-ok-light text-ok", icon: "bg-ok text-white" },
    fake: { Icon: AlertTriangle, chip: "bg-danger-light text-danger", icon: "bg-danger text-white" },
    unverified: { Icon: HelpCircle, chip: "bg-warn-light text-warn", icon: "bg-[#f5a623] text-white" },
  }[verdict.outcome];
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
      <div role="dialog" aria-modal="true" aria-labelledby="result-title" className="w-full max-w-[440px] rounded-t-[32px] bg-white p-7 text-ink shadow-2xl sm:rounded-[32px]">
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone.icon}`}><tone.Icon size={28} /></span>
        <span className={`mt-5 inline-block rounded-full px-3 py-1 text-sm font-bold ${tone.chip}`}>{o.badge}</span>
        <h2 id="result-title" className="mt-3 text-2xl font-bold tracking-[-0.02em]">{o.title}</h2>
        <p className="mt-2 leading-relaxed text-sub">{o.desc}</p>
        <dl className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-soft p-4 text-center">
          <div><dt className="text-xs text-muted">찾은 비즈</dt><dd className="mt-1 text-lg font-bold">{verdict.beads}개</dd></div>
          <div><dt className="text-xs text-muted">일치한 비즈</dt><dd className="mt-1 text-lg font-bold">{verdict.matched}개</dd></div>
          <div><dt className="text-xs text-muted">일치도</dt><dd className="mt-1 text-lg font-bold">{verdict.score === null ? "-" : `${Math.round(verdict.score * 100)}%`}</dd></div>
        </dl>
        {verdict.serial && <p className="mt-4 text-center text-sm text-sub">스티커 시리얼 <span className="font-semibold text-ink">{verdict.serial}</span></p>}
        <button type="button" onClick={onRetry} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sky font-semibold text-white hover:bg-sky-dark">
          <RotateCcw size={18} />
          다시 촬영하기
        </button>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, current, onChange }: { label: string; value: string; min: number; max: number; step: number; current: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm">
        <span className="font-semibold text-sub">{label}</span>
        <span className="font-semibold text-sky">{value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={current} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-sky" />
    </label>
  );
}
