export type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  options: { color?: string; size?: string; model?: string; style?: string };
  price: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  currency: "USD";
  compareAtPrice?: number;
  sku: string;
  stock: number;
  variants: ProductVariant[];
  category: string;
  status: "active" | "draft";
  weight?: number;
  dimensions?: { length: number; width: number; height: number; unit: "cm" };
  visualType: string;
};

export const catalog: Product[] = [
  {
    id: "prod_drive",
    slug: "drive-organizer",
    name: "Drive Organizer",
    description: "A considered place for everything you reach for on the road.",
    images: [],
    price: 4900,
    currency: "USD",
    sku: "FID-DRV-001",
    stock: 50,
    variants: [
      {
        id: "drv-black",
        sku: "FID-DRV-001-BLK",
        name: "Black",
        options: { color: "Black" },
        price: 4900,
        stock: 50,
      },
    ],
    category: "Drive",
    status: "active",
    weight: 0.65,
    dimensions: { length: 36, width: 22, height: 18, unit: "cm" },
    visualType: "organizer",
  },
  {
    id: "prod_travel",
    slug: "travel-console",
    name: "Travel Console",
    description:
      "Keep the small essentials of every journey within easy reach.",
    images: [],
    price: 3900,
    currency: "USD",
    sku: "FID-TRV-001",
    stock: 40,
    variants: [
      {
        id: "trv-sand",
        sku: "FID-TRV-001-SND",
        name: "Sand",
        options: { color: "Sand" },
        price: 3900,
        stock: 40,
      },
    ],
    category: "Travel",
    status: "active",
    weight: 0.45,
    visualType: "console",
  },
  {
    id: "prod_clean",
    slug: "clean-kit",
    name: "Compact Clean Kit",
    description: "A compact set for quick, uncomplicated interior care.",
    images: [],
    price: 3200,
    currency: "USD",
    sku: "FID-CLN-001",
    stock: 35,
    variants: [
      {
        id: "cln-standard",
        sku: "FID-CLN-001-STD",
        name: "Standard",
        options: { style: "Standard" },
        price: 3200,
        stock: 35,
      },
    ],
    category: "Care",
    status: "active",
    weight: 0.4,
    visualType: "clean",
  },
];

export const getProduct = (slug: string) =>
  catalog.find((product) => product.slug === slug);
export const getVariant = (productId: string, variantId: string) => {
  const product = catalog.find(
    (item) => item.id === productId && item.status === "active",
  );
  const variant = product?.variants.find((item) => item.id === variantId);
  return product && variant ? { product, variant } : null;
};

export const formatMoney = (cents: number, locale = "en", currency = "USD") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    cents / 100,
  );
