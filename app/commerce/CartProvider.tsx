"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./catalog";

export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variant: string;
  price: number;
  currency: string;
  quantity: number;
  visualType: string;
};
type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  add: (product: Product, variantId?: string) => void;
  remove: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "fidoria_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);
  const add = (product: Product, variantId = product.variants[0].id) => {
    const variant =
      product.variants.find((v) => v.id === variantId) ?? product.variants[0];
    setItems((current) => {
      const found = current.find(
        (i) => i.productId === product.id && i.variantId === variant.id,
      );
      if (found)
        return current.map((i) =>
          i === found
            ? { ...i, quantity: Math.min(i.quantity + 1, variant.stock) }
            : i,
        );
      return [
        ...current,
        {
          productId: product.id,
          variantId: variant.id,
          slug: product.slug,
          name: product.name,
          variant: variant.name,
          price: variant.price,
          currency: product.currency,
          quantity: 1,
          visualType: product.visualType,
        },
      ];
    });
    setDrawerOpen(true);
    window.dispatchEvent(
      new CustomEvent("fidoria:add_to_cart", {
        detail: { product_id: product.id, variant_id: variant.id },
      }),
    );
  };
  const remove = (productId: string, variantId: string) =>
    setItems((current) =>
      current.filter(
        (i) => !(i.productId === productId && i.variantId === variantId),
      ),
    );
  const setQuantity = (
    productId: string,
    variantId: string,
    quantity: number,
  ) =>
    setItems((current) =>
      quantity < 1
        ? current.filter(
            (i) => !(i.productId === productId && i.variantId === variantId),
          )
        : current.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.min(99, Math.floor(quantity)) }
              : i,
          ),
    );
  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
      drawerOpen,
      add,
      remove,
      setQuantity,
      clear: () => setItems([]),
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [items, drawerOpen],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
