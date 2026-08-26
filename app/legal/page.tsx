import type { Metadata } from "next";
import { LegalContact, LegalPage } from "../components/LegalPage";

export const metadata: Metadata = { title: "Aviso legal | FIDORIA" };

export default function LegalNoticePage() {
  return (
    <LegalPage title="Aviso legal" updated="14 de agosto de 2026">
      <section>
        <h2>Responsable del sitio</h2>
        <p>
          Este sitio web y la marca comercial Fidoria son administrados por una
          persona natural independiente:
        </p>
        <LegalContact />
      </section>
      <section>
        <h2>Finalidad</h2>
        <p>
          Fidoria presenta servicios de diseño, desarrollo, rediseño y
          mantenimiento de sitios web. La información publicada es general y
          las características definitivas de cada servicio se establecen en una
          cotización o acuerdo particular.
        </p>
      </section>
      <section>
        <h2>Propiedad intelectual</h2>
        <p>
          Salvo que se indique lo contrario, el diseño, la marca, los textos y
          los elementos propios de este sitio pertenecen a su responsable. Las
          marcas o materiales de terceros pertenecen a sus respectivos titulares.
        </p>
      </section>
      <section>
        <h2>Contacto</h2>
        <p>
          Las consultas legales, comerciales o relacionadas con este sitio se
          pueden enviar al correo indicado anteriormente.
        </p>
      </section>
    </LegalPage>
  );
}
