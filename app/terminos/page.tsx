import type { Metadata } from "next";
import { LegalContact, LegalPage } from "../components/LegalPage";

export const metadata: Metadata = { title: "Términos del servicio | FIDORIA" };

export default function TermsPage() {
  return (
    <LegalPage title="Términos del servicio" updated="14 de agosto de 2026">
      <section>
        <h2>Proveedor</h2>
        <LegalContact />
        <p>Fidoria es el nombre comercial utilizado para ofrecer estos servicios.</p>
      </section>
      <section>
        <h2>Cotizaciones y contratación</h2>
        <p>
          Enviar el formulario no crea por sí solo un contrato ni obliga a
          aceptar un proyecto. El alcance, precio total, forma de pago, plazos,
          entregables y revisiones se definirán en una cotización o acuerdo que
          ambas partes deberán aceptar antes de iniciar el trabajo.
        </p>
      </section>
      <section>
        <h2>Precios publicados</h2>
        <p>
          Los valores mostrados en el sitio están expresados en pesos chilenos y
          describen planes o precios de referencia. El valor definitivo depende
          del alcance solicitado. Cualquier costo adicional deberá informarse y
          aceptarse antes de incorporarlo al proyecto.
        </p>
      </section>
      <section>
        <h2>Obligaciones del cliente</h2>
        <p>
          El cliente debe entregar oportunamente textos, imágenes, accesos y
          aprobaciones necesarios, y declara contar con autorización para usar
          los materiales que proporcione. Los retrasos en esa entrega pueden
          modificar los plazos acordados.
        </p>
      </section>
      <section>
        <h2>Pagos, cambios y cancelaciones</h2>
        <p>
          Los hitos de pago, anticipos, número de revisiones y condiciones de
          cancelación se indicarán en cada cotización. Los trabajos o gastos ya
          ejecutados podrán cobrarse en proporción al avance, sin limitar los
          derechos irrenunciables que la legislación chilena reconozca al
          consumidor.
        </p>
      </section>
      <section>
        <h2>Entrega y propiedad intelectual</h2>
        <p>
          La entrega y publicación se realizarán según el acuerdo particular.
          Salvo pacto distinto, los derechos sobre el resultado final creado
          específicamente para el cliente se transfieren una vez pagado el
          precio total. Herramientas, componentes reutilizables, licencias y
          materiales de terceros conservan sus condiciones propias.
        </p>
      </section>
      <section>
        <h2>Disponibilidad y responsabilidad</h2>
        <p>
          Fidoria procurará prestar los servicios con diligencia profesional.
          La disponibilidad de servicios externos, dominios, alojamiento o
          integraciones de terceros puede depender de sus respectivos
          proveedores. Cada situación se resolverá conforme al acuerdo del
          proyecto y a la legislación chilena aplicable.
        </p>
      </section>
      <section>
        <h2>Contacto</h2>
        <p>
          Para consultas, reclamos o solicitudes relacionadas con un servicio,
          escribe a
          {" "}<a href="mailto:Fvargasm2003@hotmail.com">Fvargasm2003@hotmail.com</a>.
        </p>
      </section>
    </LegalPage>
  );
}
