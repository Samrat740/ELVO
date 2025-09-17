"use client";

import Link from "next/link";
import { LogOut, Package, ShoppingCart, UserCog } from "lucide-react";
import { useCart } from "@/hooks/use-cart.tsx";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const { cartCount } = useCart();
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <span className="font-bold sm:inline-block">
            TTREND NEST
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
        </nav>
        <div className="flex items-center justify-end space-x-2">
           {currentUser ? (
             <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                  <UserCog className="h-5 w-5" />
                  <span className="sr-only">Admin Panel</span>
                </Link>
              </Button>
               <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
              </Button>
             </>
           ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Admin</Link>
              </Button>
           )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
