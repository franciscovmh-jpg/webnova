import PageShell from "../components/PageShell";export const metadata={title:"Bag"};
export default function Cart(){return <PageShell title="Your bag." intro="Your bag is currently empty."><a className="button dark" href="/shop">Explore the collection <span>↗</span></a></PageShell>}
