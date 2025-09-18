
"use client";

import Link from "next/link";
import { LogOut, ShoppingCart, UserCog, UserCircle, Package, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart.tsx";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

const ElvoLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-7 w-7 text-primary"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z" transform="scale(1.1)"/>
    <path d="M7.5 12.5 L16.5 12.5" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 7.5 L12 16.5" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
     <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontWeight="bold" fill="hsl(var(--foreground))" fontFamily="sans-serif">E</text>
  </svg>
);


export default function Header() {
  const { cartCount } = useCart();
  const { currentUser, isAdmin, logout } = useAuth();

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }

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
           <Button variant="link" asChild className="text-foreground/80 hover:text-primary"><Link href="/#">Contact</Link></Button>
        </nav>
        <div className="flex items-center justify-end space-x-1">
           {currentUser ? (
              isAdmin ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                         <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
                          </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/products"><Package className="mr-2 h-4 w-4" /> Products</Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="/admin/orders"><ShoppingCart className="mr-2 h-4 w-4" /> Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                         <Avatar>
                            <AvatarFallback>{getInitials(currentUser.email)}</AvatarFallback>
                          </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/orders"><Package className="mr-2 h-4 w-4" /> My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              )
           ) : (
             <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <UserCircle className="h-5 w-5" />
                   <span className="sr-only">Login</span>
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
