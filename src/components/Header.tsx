
"use client";

import Link from "next/link";
import { LogOut, ShoppingCart, UserCog, UserCircle, Package, User, Search } from "lucide-react";
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
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

const ElvoLogo = () => (
  <Image src="https://res.cloudinary.com/dq2julnka/image/upload/v1758224893/gg_vhhwtl.png" alt="ELVO Logo" width={32} height={32} />
);

function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search products..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </form>
    );
}


export default function Header() {
  const { cartCount } = useCart();
  const { currentUser, isAdmin, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        <nav className="hidden md:flex flex-1 items-center space-x-1">
           <Button variant="link" asChild className="text-foreground/80 hover:text-primary"><Link href="/products">Collection</Link></Button>
           <Button variant="link" asChild className="text-foreground/80 hover:text-primary"><Link href="/contact">Contact</Link></Button>
        </nav>
        <div className="flex flex-1 md:flex-none items-center justify-end md:justify-center px-4">
          <div className="hidden md:block w-full max-w-sm">
            <SearchBar />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-1">
           {isClient && (<>
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
                       <DropdownMenuItem asChild className="md:hidden">
                        <Link href="/products"><Search className="mr-2 h-4 w-4" /> Search</Link>
                      </DropdownMenuItem>
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
          </>)}
        </div>
      </div>
      <div className="md:hidden container pb-4">
        <SearchBar />
      </div>
    </header>
  );
}

