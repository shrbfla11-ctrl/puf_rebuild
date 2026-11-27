"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AlertTriangle, BadgeCheck, CircleHelp, HelpCircle, Image as ImageIcon, RotateCcw, ShieldCheck, SlidersHorizontal, X, Zap, ZapOff } from "lucide-react";
import { DEFAULT_SETTINGS, clampSettings, readSettings, subscribeSettings, writeSettings, type CaptureSettings } from "@/lib/scan/capture";
import { outcomeText, scanText as t } from "@/content/scan";

type ScanState = "idle" | "charging" | "capturing" | "analyzing" | "error";
type Verdict = { outcome: "genuine" | "fake" | "unverified"; serial: string | null; score: number | null; beads: number; matched: number };

/** 촬영 사진 한 변 크기(px) */
const FRAME_PX = 800;
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const roundBtn = "flex items-center justify-center rounded-full bg-white/12 text-white backdrop-blur hover:bg-white/22 disabled:opacity-50";

/**
 * 카메라 스캔 화면.
 * 촬영 버튼 한 번으로 [플래시 켜서 빛 충전 → 플래시 끄기 → 연속 촬영 → 서버 판별] 순서로 진행돼요.
 * 카메라를 쓸 수 없으면 예시 스티커 그림과 갤러리 선택만 보여줘요.
 */
export function ScanView({ frameClass = "w-[240px]" }: { frameClass?: string }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [hasCamera, setHasCamera] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<{ title: string; desc: string } | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // 등록 모드: 촬영한 패턴을 대조하지 않고 입력한 시리얼로 저장해요. (TODO: 데이터베이스 연결 후 관리자에게만 보이게)
  const [enrollMode, setEnrollMode] = useState(false);
  const [enrollSerial, setEnrollSerial] = useState("");
  // 촬영 조건(실험용)은 이 기기에 기억해요.
  const settings = useSyncExternalStore(subscribeSettings, readSettings, () => DEFAULT_SETTINGS);
  const update = (patch: Partial<CaptureSettings>) => writeSettings(clampSettings({ ...settings, ...patch }));

  // 후면 카메라 켜기
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) return;
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

  const showError = useCallback((title: string, desc: string) => {
    setErrorMsg({ title, desc });
    setState("error");
    window.setTimeout(() => {
      setState((s) => (s === "error" ? "idle" : s));
      setErrorMsg(null);
    }, 3200);
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
      setState("idle");
    } catch {
      showError("분석에 실패했어요", "네트워크 상태를 확인하고 다시 시도해 주세요.");
    }
  }

  async function capture() {
    if (state !== "idle") return;
    if (enrollMode) {
      if (!enrollSerial.trim()) return showError("시리얼이 없어요", "등록할 스티커 시리얼을 입력해 주세요.");
      return showError("아직 등록할 수 없어요", t.enrollNeedsDb);
    }
    const video = videoRef.current;
    if (!hasCamera || !video || video.videoWidth === 0) {
      return showError("카메라를 사용할 수 없어요", "카메라 권한을 허용하거나 갤러리에서 이미지를 선택해 주세요.");
    }
    setSettingsOpen(false);
    const used = settings;

    // 1) 플래시로 빛 충전 → 2) 끄기
    if (torchSupported) {
      setState("charging");
      if (await setTorch(true)) {
        await sleep(used.chargeMs);
        await setTorch(false);
      } else {
        setTorchSupported(false); // 지원한다고 했지만 켜지지 않는 기기
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
    if (frames.length === 0) return showError("초점이 맞지 않아요", "스티커에 가까이 대고 흔들리지 않게 다시 촬영해 주세요.");
    // 4) 판별
    analyze(frames, timestamps);
  }

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) analyze([file], [0]);
  }

  const charging = state === "charging";
  const busy = state === "charging" || state === "capturing" || state === "analyzing";
  const isError = state === "error";
  const centerText = charging
    ? t.charging
    : state === "capturing"
      ? progress ? `${t.capturing} ${progress.done} / ${progress.total}` : `${t.capturing}이에요`
      : state === "analyzing"
        ? t.analyzing
        : t.guide;
  const corner = `absolute h-9 w-9 [border-width:3px] ${isError ? "border-danger" : charging ? "border-white" : "border-sky"}`;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[radial-gradient(80%_60%_at_50%_40%,#1c4361_0%,#12324a_55%,#0b1f2e_100%)] text-white">
      {/* 카메라 화면 */}
      <video ref={videoRef} playsInline muted className={`absolute inset-0 h-full w-full object-cover ${hasCamera ? "opacity-100" : "opacity-0"}`} />
      {hasCamera && <div className="absolute inset-0 bg-[#0b1f2e]/25" />}
      {/* 충전 중에는 화면 가장자리가 하늘색으로 빛나요 */}
      {charging && <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_30px_rgba(125,211,252,0.45)]" />}

      {/* 상단 */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-4">
        <button type="button" aria-label="닫기" onClick={() => router.push("/")} className={`${roundBtn} h-11 w-11`}><X size={22} /></button>
        <span className="text-[15px] font-semibold">{t.title}</span>
        <span className="flex gap-2">
          <button type="button" aria-label="촬영 조건" aria-expanded={settingsOpen} disabled={busy} onClick={() => setSettingsOpen((v) => !v)} className={`${roundBtn} h-11 w-11 ${settingsOpen ? "bg-white/30" : ""}`}>
            <SlidersHorizontal size={22} />
          </button>
          <Link href="/#how" aria-label="도움말" className={`${roundBtn} h-11 w-11`}><CircleHelp size={22} /></Link>
        </span>
      </header>

      {/* 대조 / 등록 모드 */}
      <div className="relative z-10 mx-4 mt-3 flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 backdrop-blur">
        <button
          type="button"
          role="switch"
          aria-checked={enrollMode}
          onClick={() => setEnrollMode((v) => !v)}
          disabled={busy}
          className={`flex h-8 flex-none items-center rounded-full px-3 text-xs font-bold ${enrollMode ? "bg-sky-mid text-ink" : "bg-white/15 text-white"}`}
        >
          {enrollMode ? "등록 모드" : "대조 모드"}
        </button>
        {enrollMode && (
          <input
            value={enrollSerial}
            onChange={(e) => setEnrollSerial(e.target.value.toUpperCase())}
            placeholder="스티커 시리얼 (PUF-LM26-000001)"
            spellCheck={false}
            aria-label="등록할 스티커 시리얼"
            className="h-8 min-w-0 flex-1 rounded-lg bg-white/90 px-2.5 text-[13px] font-semibold text-ink outline-none placeholder:text-muted"
          />
        )}
      </div>

      {/* 촬영 조건 패널 (논문 실험용) */}
      {settingsOpen && (
        <div className="absolute inset-x-4 top-[76px] z-20 flex flex-col gap-4 rounded-3xl bg-white p-5 text-ink shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold">촬영 조건</span>
            <button type="button" onClick={() => writeSettings(DEFAULT_SETTINGS)} className="text-[13px] font-semibold text-sub hover:text-ink">기본값</button>
          </div>
          <Slider label="플래시 조사 시간" value={`${(settings.chargeMs / 1000).toFixed(1)}초`} min={500} max={10000} step={100} current={settings.chargeMs} onChange={(v) => update({ chargeMs: v })} />
          <Slider label="촬영 프레임 수" value={`${settings.frameCount}장`} min={1} max={30} step={1} current={settings.frameCount} onChange={(v) => update({ frameCount: v })} />
          <Slider label="프레임 간격" value={`${settings.frameIntervalMs}ms`} min={50} max={1000} step={50} current={settings.frameIntervalMs} onChange={(v) => update({ frameIntervalMs: v })} />
          <p className="text-xs text-muted">
            플래시를 끈 뒤 총 <span className="font-semibold text-sub">{(((settings.frameCount - 1) * settings.frameIntervalMs) / 1000).toFixed(1)}초</span> 동안 촬영해요. 설정은 이 기기에 저장돼요.
          </p>
        </div>
      )}

      {/* 오류 알림 */}
      {isError && errorMsg && (
        <div role="alert" className="absolute inset-x-4 top-[76px] z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-ink shadow-2xl">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-danger-light text-danger"><AlertTriangle size={20} strokeWidth={2.5} /></span>
          <span className="flex-1">
            <span className="block text-[15px] font-bold">{errorMsg.title}</span>
            <span className="mt-0.5 block text-[13px] text-sub">{errorMsg.desc}</span>
          </span>
        </div>
      )}

      {/* 가운데: 안내 + 촬영 사각형 */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-4 sm:gap-6 sm:p-6">
        <div className="flex items-center gap-2 text-base font-semibold text-white/90" aria-live="polite">
          {busy && <span className={`h-2 w-2 animate-pulse rounded-full ${charging ? "bg-white" : "bg-sky-mid"}`} />}
          {centerText}
        </div>
        <div className={`relative aspect-square ${frameClass}`}>
          <span className={`${corner} left-0 top-0 rounded-tl-xl border-b-0 border-r-0`} />
          <span className={`${corner} right-0 top-0 rounded-tr-xl border-b-0 border-l-0`} />
          <span className={`${corner} bottom-0 left-0 rounded-bl-xl border-r-0 border-t-0`} />
          <span className={`${corner} bottom-0 right-0 rounded-br-xl border-l-0 border-t-0`} />
          {/* 카메라가 없을 때 보여주는 예시 스티커 */}
          {!hasCamera && (
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 -rotate-[4deg] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f7fbfe] to-[#d6e6f2] shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
              style={{ filter: isError ? "blur(2px)" : "none" }}
            >
              <div className="absolute inset-2.5 rounded-[10px] opacity-90 [background:repeating-radial-gradient(circle_at_30%_40%,#7c91a3_0_1px,transparent_1px_6px),repeating-radial-gradient(circle_at_70%_60%,#9fb2c1_0_1px,transparent_1px_5px),repeating-linear-gradient(45deg,rgba(74,98,117,0.22)_0_1px,transparent_1px_7px)]" />
              <span className="relative rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold tracking-[0.16em] text-sky-dark">PUF</span>
            </div>
          )}
          {state === "capturing" && progress && (
            <div className="absolute inset-x-5 bottom-5 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-sky-mid transition-[width] duration-150" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
            </div>
          )}
          {state === "analyzing" && <span className="motion-safe-anim absolute inset-x-2 h-0.5 animate-scan bg-gradient-to-r from-sky-mid/0 via-sky-mid to-sky-mid/0 shadow-[0_0_16px_3px_rgba(125,211,252,0.6)]" />}
        </div>
        <p className="min-h-6 max-w-[340px] text-center text-sm text-white/70">
          {busy
            ? t.holdStill
            : isError
              ? "초점과 주변 조명을 확인해 주세요"
              : !hasCamera
                ? t.noCamera
                : !torchSupported
                  ? t.noTorch
                  : `플래시 ${(settings.chargeMs / 1000).toFixed(1)}초 → 끈 뒤 ${settings.frameCount}장 연속 촬영`}
        </p>
      </div>

      {/* 하단: 플래시 상태 · 촬영 버튼 · 갤러리 */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-8 pb-4 sm:gap-5 sm:pb-6">
        <div className="flex w-full max-w-[360px] items-center justify-between">
          {/* 플래시는 촬영할 때 자동으로 켜졌다 꺼져요. 여기서는 상태만 보여줘요. */}
          <span
            role="status"
            aria-label={!torchSupported ? "플래시 사용 불가" : torchOn ? "플래시 충전 중" : "플래시 대기"}
            className={`flex h-14 w-14 items-center justify-center rounded-full ${!torchSupported ? "bg-white/12 text-white/40" : torchOn ? "bg-white text-sky-dark" : "bg-white/12 text-white"}`}
          >
            {torchSupported ? <Zap size={24} fill={torchOn ? "currentColor" : "none"} /> : <ZapOff size={24} />}
          </span>
          <button type="button" aria-label="촬영" onClick={capture} disabled={busy} className="flex h-20 w-20 rounded-full border-4 border-white p-1">
            <span className={`flex flex-1 items-center justify-center rounded-full ${charging ? "bg-white" : busy ? "bg-sky" : "bg-white"}`}>
              {busy && <span className={`h-[22px] w-[22px] animate-spin rounded-full border-[3px] ${charging ? "border-sky/30 border-t-sky" : "border-white/35 border-t-white"}`} />}
            </span>
          </button>
          <button type="button" aria-label="갤러리" onClick={() => fileRef.current?.click()} disabled={busy} className={`${roundBtn} h-14 w-14`}>
            <ImageIcon size={24} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/55"><ShieldCheck size={14} />{t.privacy}</div>
      </div>

      {verdict && <ResultSheet verdict={verdict} onRetry={() => setVerdict(null)} />}
    </div>
  );
}

/** 판정 결과를 아래에서 올라오는 카드로 보여줘요. (TODO: 데이터베이스 연결 후 결과 페이지·기록 저장) */
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
