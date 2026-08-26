import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = { title: "Política de cookies | FIDORIA" };

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies" updated="14 de agosto de 2026">
      <section>
        <h2>Uso actual de cookies</h2>
        <p>
          Fidoria no instala actualmente cookies propias de análisis,
          publicidad, personalización ni seguimiento. Tampoco utiliza Google
          Analytics, píxeles publicitarios ni herramientas equivalentes.
        </p>
      </section>
      <section>
        <h2>Servicios técnicos</h2>
        <p>
          El sitio utiliza Cloudflare para alojamiento, seguridad y entrega del
          contenido. En circunstancias excepcionales de seguridad, Cloudflare
          podría aplicar mecanismos técnicos necesarios para proteger el sitio.
          No los utilizamos para crear perfiles publicitarios.
        </p>
      </section>
      <section>
        <h2>Consentimiento</h2>
        <p>
          Como el sitio no usa cookies opcionales, actualmente no se muestra un
          banner de consentimiento. Si en el futuro incorporamos medición,
          publicidad u otras cookies opcionales, actualizaremos esta política y
          solicitaremos consentimiento antes de activarlas cuando corresponda.
        </p>
      </section>
      <section>
        <h2>Consultas</h2>
        <p>
          Puedes consultar sobre esta política escribiendo a
          {" "}<a href="mailto:Fvargasm2003@hotmail.com">Fvargasm2003@hotmail.com</a>.
        </p>
      </section>
    </LegalPage>
  );
}
