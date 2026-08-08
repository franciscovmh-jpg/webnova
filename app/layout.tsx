import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"Webnova | Páginas web profesionales en Chile",description:"Diseño, desarrollo, rediseño y mantenimiento de páginas web para emprendedores, profesionales y pymes en Chile.",icons:{icon:"/favicon.svg"},openGraph:{title:"Webnova — Presencia digital profesional",description:"Creamos páginas web modernas que impulsan tu negocio.",type:"website"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
