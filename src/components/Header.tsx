"use client";

import Link from "next/link";
import { LogOut, ShoppingCart, UserCog, UserPlus } from "lucide-react";
import { useCart } from "@/hooks/use-cart.tsx";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const ElvoLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6 text-primary"
  >
    <path d="M6.75 3h-2.25L3 4.5v15l1.5 1.5h15l1.5-1.5v-15L19.5 3h-2.25V1.5h-9V3zM10.5 3h3V1.5h-3V3zm-5.25 3h13.5v13.5H5.25V6zM12 18a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0-1.5a3 3 0 110-6 3 3 0 010 6z" />
  </svg>
);


export default function Header() {
  const { cartCount } = useCart();
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ElvoLogo />
          <span className="font-bold sm:inline-block font-headline tracking-wider text-xl">
            ELVO
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1">
           <Button variant="link" asChild className="text-foreground/80 hover:text-primary"><Link href="#featured">Collection</Link></Button>
           <Button variant="link" asChild className="text-foreground/80 hover:text-primary"><Link href="/#">About</Link></Button>
           <Button variant="link" asChild className="text-foreground/80 hover:text-primary"><Link href="/#">Contact</Link></Button>
        </nav>
        <div className="flex items-center justify-end space-x-1">
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
              <Button variant="ghost" size="icon" asChild>
                <Link href="/signup">
                  <UserPlus className="h-5 w-5" />
                   <span className="sr-only">Sign Up</span>
                </Link>
              </Button>
           )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
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
