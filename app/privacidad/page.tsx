import type { Metadata } from "next";
import { LegalContact, LegalPage } from "../components/LegalPage";

export const metadata: Metadata = { title: "Política de privacidad | FIDORIA" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidad" updated="14 de agosto de 2026">
      <section>
        <h2>Responsable del tratamiento</h2>
        <LegalContact />
      </section>
      <section>
        <h2>Datos que recopilamos</h2>
        <p>
          Al solicitar una cotización podemos recibir tu nombre, correo
          electrónico, teléfono o WhatsApp, nombre del negocio, tipo de
          proyecto, presupuesto, dirección de tu sitio actual y la descripción
          que decidas proporcionar.
        </p>
      </section>
      <section>
        <h2>Para qué usamos los datos</h2>
        <ul>
          <li>Responder tu solicitud y preparar una cotización.</li>
          <li>Contactarte para aclarar requisitos del proyecto.</li>
          <li>Gestionar la relación precontractual y, si aceptas, el servicio.</li>
          <li>Prevenir abusos y mantener la seguridad del formulario.</li>
        </ul>
        <p>No utilizamos estos datos para enviar publicidad no solicitada.</p>
      </section>
      <section>
        <h2>Proveedores y transferencias</h2>
        <p>
          El sitio opera sobre infraestructura de Cloudflare y las solicitudes
          del formulario se envían por correo mediante Resend. Estos proveedores
          pueden procesar datos técnicos o del mensaje fuera de Chile conforme
          a sus condiciones y medidas de seguridad. No vendemos tus datos
          personales.
        </p>
      </section>
      <section>
        <h2>Conservación</h2>
        <p>
          Las solicitudes que no se conviertan en clientes se conservarán por
          un máximo de 12 meses, salvo que solicites su eliminación antes. Los
          antecedentes asociados a un servicio contratado podrán conservarse
          durante los plazos necesarios para cumplir obligaciones contractuales,
          tributarias o legales.
        </p>
      </section>
      <section>
        <h2>Tus derechos</h2>
        <p>
          Puedes solicitar información, corrección, actualización, eliminación
          o el cese del uso de tus datos cuando corresponda. Escribe a
          {" "}<a href="mailto:Fvargasm2003@hotmail.com">Fvargasm2003@hotmail.com</a>
          {" "}indicando tu solicitud y un medio para verificar tu identidad.
        </p>
      </section>
      <section>
        <h2>Seguridad y cambios</h2>
        <p>
          Aplicamos medidas razonables para proteger la información. Esta
          política podrá actualizarse si cambian el sitio, sus proveedores o la
          normativa aplicable; la fecha vigente siempre aparecerá al inicio.
        </p>
      </section>
    </LegalPage>
  );
}
