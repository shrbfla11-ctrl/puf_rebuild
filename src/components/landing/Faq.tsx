"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faq } from "@/content/landing";
import { Reveal } from "@/components/ui/Reveal";

/** 자주 묻는 질문 (누르면 펼쳐지는 목록) */
export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="mx-auto w-full max-w-[820px] px-5 py-24 lg:py-36">
      <Reveal>
        <h2 className="text-center text-[36px] font-bold tracking-[-0.03em] sm:text-5xl">{faq.title}</h2>
      </Reveal>
      <Reveal className="mt-12 border-t border-line lg:mt-16">
        {faq.items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="border-b border-line">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
              >
                <span className="text-lg font-semibold lg:text-xl">{f.q}</span>
                <Plus size={22} className={`flex-none text-sky transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                <p className="overflow-hidden text-[17px] leading-relaxed text-sub">{f.a}</p>
              </div>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
