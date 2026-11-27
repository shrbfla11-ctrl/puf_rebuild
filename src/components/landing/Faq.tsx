"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faq } from "@/content/landing";

/** 자주 묻는 질문 (누르면 펼쳐지는 목록) */
export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="mx-auto w-full max-w-[800px] px-5 pb-16 lg:px-8 lg:pb-24">
      <h2 className="text-center text-[28px] font-bold tracking-[-0.02em] lg:text-4xl">{faq.title}</h2>
      <div className="mt-8 flex flex-col gap-3 lg:mt-12">
        {faq.items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={`rounded-xl border bg-white ${isOpen ? "border-sky-mid" : "border-line"}`}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold">{f.q}</span>
                <ChevronDown size={20} className={`flex-none text-muted transition-transform ${isOpen ? "rotate-180 text-sky" : ""}`} />
              </button>
              {isOpen && <p className="px-5 pb-5 text-[15px] leading-relaxed text-sub">{f.a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
