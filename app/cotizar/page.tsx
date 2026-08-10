import type { Metadata } from "next";
import QuoteFlow from "./QuoteFlow";

export const metadata:Metadata={title:"Solicita tu cotización | FIDORIA",description:"Elige la solución ideal para tu proyecto y solicita una cotización personalizada a Fidoria."};

export default function QuotePage(){return <QuoteFlow/>}
