"use client";

import { useEffect } from "react";

const revealSelectors = [
  ".hero-copy",
  ".hero .visual",
  "main .section .container > *",
  ".footer-grid",
  ".footer-bottom",
];

export default function ScrollReveal() {
  useEffect(() => {
    const elements = Array.from(
      new Set(document.querySelectorAll<HTMLElement>(revealSelectors.join(","))),
    );

    elements.forEach((element) => {
      element.classList.add("scroll-reveal");
      const siblings = Array.from(element.parentElement?.children ?? []);
      const index = siblings.indexOf(element);
      element.style.setProperty("--reveal-delay", `${Math.min(Math.max(index, 0), 5) * 75}ms`);
    });

    document.documentElement.classList.add("reveal-ready");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("reveal-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6%", threshold: 0.05 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
