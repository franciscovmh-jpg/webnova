import type { ReactNode } from "react";
import { Logo } from "./Header";

export const legalOwner = {
  name: "Francisco Humberto Vargas Maldonado",
  rut: "21.396.625-1",
  email: "Fvargasm2003@hotmail.com",
  location: "Corral, Valdivia, Chile",
};

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Logo />
        <a href="/">← Volver al sitio</a>
      </header>
      <article className="legal-document">
        <span className="kicker">Información legal de Fidoria</span>
        <h1>{title}</h1>
        <p className="legal-updated">Última actualización: {updated}</p>
        {children}
      </article>
    </main>
  );
}

export function LegalContact() {
  return (
    <address className="legal-contact">
      <strong>{legalOwner.name}</strong>
      <span>RUT: {legalOwner.rut}</span>
      <span>{legalOwner.location}</span>
      <a href={`mailto:${legalOwner.email}`}>{legalOwner.email}</a>
    </address>
  );
}
