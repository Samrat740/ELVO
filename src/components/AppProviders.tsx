
"use client";

import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart.tsx";
import { ProductsProvider } from "@/hooks/use-products.tsx";
import { OrdersProvider } from "@/hooks/use-orders";
import { WishlistProvider } from "@/hooks/use-wishlist";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProductsProvider>
        <OrdersProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </OrdersProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
