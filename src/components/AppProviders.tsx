"use client";

import { CartProvider } from "@/hooks/use-cart";
import { ProductsProvider } from "@/hooks/use-products";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProductsProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ProductsProvider>
  );
}
