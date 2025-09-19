
"use client";

import Link from "next/link";
import { LogOut, ShoppingCart, UserCog, UserCircle, Package, User, Search, Menu, Home, Phone, X } from "lucide-react";
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
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";

const ElvoLogo = () => (
  <Image src="https://res.cloudinary.com/dq2julnka/image/upload/v1758224893/gg_vhhwtl.png" alt="ELVO Logo" width={32} height={32} />
);

function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full">
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

function MobileNav({ closeSheet }: { closeSheet: () => void }) {
  const { currentUser, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    closeSheet();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    closeSheet();
  }

  return (
    <div className="flex h-full flex-col">
       <SheetHeader className="p-4 border-b">
         <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
            <ElvoLogo />
            <span className="font-bold sm:inline-block font-headline tracking-wider text-xl">
              ELVO
            </span>
          </Link>
       </SheetHeader>
       <div className="flex-1 overflow-y-auto">
        <nav className="grid gap-2 p-4 text-lg font-medium">
          <Link href="/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={closeSheet}>
            <Package className="h-5 w-5" />
            Collection
          </Link>
          <Link href="/contact" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={closeSheet}>
            <Phone className="h-5 w-5" />
            Contact
          </Link>
          {currentUser && !isAdmin && (
            <Link href="/orders" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={closeSheet}>
               <ShoppingCart className="h-5 w-5" />
               My Orders
            </Link>
          )}
        </nav>
       </div>
       <div className="mt-auto border-t p-4">
         {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 px-3">
                  <Avatar className="h-8 w-8">
                      <AvatarFallback>{isAdmin ? 'A' : currentUser.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">{isAdmin ? "Admin" : (currentUser.displayName || "My Account")}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{currentUser.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{isAdmin ? 'Admin Account' : 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                  {isAdmin ? (
                    <>
                      <DropdownMenuItem onClick={() => handleNavigation('/admin/products')}><Package className="mr-2 h-4 w-4" /> Products</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation('/admin/orders')}><ShoppingCart className="mr-2 h-4 w-4" /> Orders</DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => handleNavigation('/orders')}><Package className="mr-2 h-4 w-4" /> My Orders</DropdownMenuItem>
                  )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
         ) : (
           <Button variant="outline" className="w-full" onClick={() => handleNavigation('/login')}>
              <UserCircle className="mr-2 h-4 w-4" />
              Login / Sign Up
           </Button>
         )}
       </div>
    </div>
  )
}

export default function Header() {
  const { cartCount } = useCart();
  const { currentUser, isAdmin, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
        <div className="md:hidden mr-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
               <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <MobileNav closeSheet={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
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
        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-center md:px-4">
          <div className="hidden md:block w-full max-w-sm">
            <SearchBar />
          </div>
          <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                      <Search className="h-5 w-5" />
                      <span className="sr-only">Search</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="top">
                    <SheetHeader>
                        <h2 className="text-lg font-semibold">Search Products</h2>
                    </SheetHeader>
                    <div className="py-4">
                      <SearchBar />
                    </div>
                </SheetContent>
              </Sheet>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-1">
           {isClient && (<>
            <div className="hidden md:block">
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
               <Button variant="ghost" asChild>
                  <Link href="/login">
                    <UserCircle className="mr-2 h-5 w-5" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </Button>
             )}
            </div>
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
    </header>
  );
}
