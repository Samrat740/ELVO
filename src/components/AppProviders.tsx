"use client";

import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart.tsx";
import { ProductsProvider } from "@/hooks/use-products.tsx";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
