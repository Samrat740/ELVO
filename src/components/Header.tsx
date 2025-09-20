
"use client";

import Link from "next/link";
import { LogOut, ShoppingCart, UserCog, UserCircle, Package, User, Search, Menu, Home, Phone, X, Heart } from "lucide-react";
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
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";

const ElvoLogo = () => (
  <Image src="https://res.cloudinary.com/dq2julnka/image/upload/v1758224893/gg_vhhwtl.png" alt="ELVO Logo" width={32} height={32} />
);

function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isSheetOpen, setIsSheetOpen] = useState(true);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            const parentSheet = (e.target as HTMLElement).closest('[data-radix-dialog-content]');
            if (parentSheet) {
              const closeButton = parentSheet.querySelector('button[aria-label="Close"]') as HTMLElement;
              closeButton?.click();
            }
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative flex w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
              placeholder="Search products..."
              className="pl-10 flex-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
          />
           <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4"/>
           </Button>
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
         <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
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
          {currentUser && (
            <>
               {!isAdmin && (
                <>
                    <Link href="/orders" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={closeSheet}>
                        <ShoppingCart className="h-5 w-5" />
                        My Orders
                    </Link>
                     <Link href="/wishlist" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={closeSheet}>
                        <Heart className="h-5 w-5" />
                        Wishlist
                    </Link>
                </>
              )}
            </>
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
                      <DropdownMenuItem onClick={() => handleNavigation('/admin/wishlist')}><Heart className="mr-2 h-4 w-4" /> Wishlist Insights</DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => handleNavigation('/orders')}><ShoppingCart className="mr-2 h-4 w-4" /> My Orders</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation('/wishlist')}><Heart className="mr-2 h-4 w-4" /> My Wishlist</DropdownMenuItem>
                    </>
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
      <div className="container relative flex h-16 items-center">
        {/* Mobile Nav */}
        <div className="md:hidden mr-2">
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

        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
            <ElvoLogo />
            <span className="font-bold sm:inline-block font-headline tracking-wider text-xl">
                ELVO
            </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
            <Button variant="link" asChild className="text-foreground/80 hover:text-primary"><Link href="/products">Collection</Link></Button>
            <Button variant="link" asChild className="text-foreground/80 hover:text-primary"><Link href="/contact">Contact</Link></Button>
            </nav>
        </div>

        {/* Center Section: Search Bar (Desktop) */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
            <SearchBar />
        </div>

        {/* Right Section: Icons & Auth */}
        <div className="flex-1 flex items-center justify-end space-x-1">
           {/* Mobile Search Icon */}
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
                        <SheetTitle>Search Products</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <SearchBar />
                    </div>
                </SheetContent>
              </Sheet>
          </div>

          {/* User Auth & Cart */}
           {isClient && (<>
            {currentUser && !isAdmin && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Link>
              </Button>
            )}
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
                        <DropdownMenuItem asChild>
                          <Link href="/admin/wishlist"><Heart className="mr-2 h-4 w-4" /> Wishlist Insights</Link>
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
                          <Link href="/orders"><ShoppingCart className="mr-2 h-4 w-4" /> My Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/wishlist"><Heart className="mr-2 h-4 w-4" /> My Wishlist</Link>
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
