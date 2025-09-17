"use client";

import { CartProvider } from "@/hooks/use-cart.tsx";
import { ProductsProvider } from "@/hooks/use-products.tsx";
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
