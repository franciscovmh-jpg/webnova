import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"Austral Web | Páginas web profesionales en Chile",description:"Diseño, desarrollo, rediseño y mantenimiento de páginas web para emprendedores, profesionales y pymes en Chile.",icons:{icon:"/favicon.svg"},openGraph:{title:"Austral Web — Presencia digital profesional",description:"Impulsa tu negocio con una presencia digital profesional.",type:"website"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
