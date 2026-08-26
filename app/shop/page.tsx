import PageShell from "../components/PageShell";
const items=[["drive-organizer","Drive Organizer","$49.00","organizer"],["travel-console","Travel Console","$39.00","console"],["clean-kit","Compact Clean Kit","$32.00","clean"]];
export const metadata={title:"Shop"};
export default function Shop(){return <PageShell title="The collection." intro="A focused edit of useful essentials for driving, travel and everyday movement."><div className="product-grid">{items.map(([slug,name,price,type])=><a className="product-card" href={`/product/${slug}`} key={slug}><div className={`product-visual ${type}`}><span>FIDORIA</span><i/><b/></div><div><small>FIDORIA Drive</small><h3>{name}</h3><p>{price} USD</p></div></a>)}</div></PageShell>}
