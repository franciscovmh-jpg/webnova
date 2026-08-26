# FIDORIA

Sitio profesional de Fidoria para ofrecer creación, rediseño y mantenimiento de páginas web. Esta versión está preparada únicamente para desarrollo local.

## Requisitos

- Node.js 22.13 o superior
- npm
- Visual Studio Code

## Abrir y ejecutar

1. Abre esta carpeta desde Visual Studio Code.
2. Abre una terminal integrada.
3. Instala dependencias: `npm install`
4. Inicia el entorno local: `npm run dev`
5. Abre la URL que aparece en la terminal (habitualmente `http://localhost:5173`).

## Ediciones frecuentes

- Colores y estilos: `app/globals.css`, variables al comienzo del archivo.
- Textos y secciones: componentes dentro de `app/components/`.
- WhatsApp, correo y redes sociales: `app/config.ts`.
- Precios: arreglo `prices` en `app/config.ts`.
- Metadatos SEO: `app/layout.tsx`.

El número de WhatsApp queda vacío intencionalmente hasta contar con uno real. Debe escribirse sin `+`, espacios ni guiones.

## Validar la compilación

Ejecuta `npm run build`. Esto comprueba que el sitio puede compilarse, pero no lo publica ni configura un dominio.

## Formulario

El formulario de cotización envía las solicitudes por correo mediante Resend. Para desarrollo local, configura `RESEND_API_KEY` y `RESEND_FROM_EMAIL` en `.dev.vars`; en producción, conserva la API key como secreto de Cloudflare.
