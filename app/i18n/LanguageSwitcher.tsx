"use client";

import { useEffect, useRef, useState } from "react";
import { languageNames, locales, type Locale } from "./config";

const languageFlags: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
};

export default function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const change = (next: Locale) => {
    document.cookie = `fidoria_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
    const parts = location.pathname.split("/");
    parts[1] = next;
    location.assign(parts.join("/") + location.search);
  };

  return <div className="language-switcher" ref={switcherRef}>
    <button className="language-trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-haspopup="listbox" aria-label={label}>
      <b className="language-trigger-flag" aria-hidden="true">{languageFlags[locale]}</b>
      <em>{locale.toUpperCase()}</em>
      <i aria-hidden="true">⌄</i>
    </button>
    {open && <div className="language-menu" role="listbox" aria-label={label}>
      <div className="language-menu-heading">{label}</div>
      {locales.map((code) => <button role="option" aria-selected={code === locale} key={code} onClick={() => change(code)}>
        <div className="language-option-main">
          <b className="language-flag" aria-hidden="true">{languageFlags[code]}</b>
          <strong>{languageNames[code]}</strong>
        </div>
        <div className="language-option-meta">
          <small>{code.toUpperCase()}</small>
          <em className="language-check" aria-hidden="true">{code === locale ? "✓" : ""}</em>
        </div>
      </button>)}
    </div>}
  </div>;
}
