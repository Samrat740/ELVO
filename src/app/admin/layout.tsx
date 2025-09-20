
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, ShoppingCart, Home, Menu, X, Heart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/wishlist", icon: Heart, label: "Wishlist Insights" },
];

function AdminNav({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
         <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
       <div className="mt-auto p-4">
         <Link href="/" onClick={onLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted">
            <Home className="h-5 w-5" />
            Back to Store
         </Link>
       </div>
    </div>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!currentUser || !isAdmin)) {
      router.push('/login');
    }
  }, [currentUser, isAdmin, loading, router]);

  if (loading || !currentUser || !isAdmin) {
    return <div className="container mx-auto py-12 px-4 text-center">Loading...</div>;
  }
  
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 border-r bg-background">
        <AdminNav />
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-background animate-in slide-in-from-left-full duration-300">
              <AdminNav onLinkClick={() => setIsSidebarOpen(false)} />
               <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </aside>
        </div>
      )}
      
      <main className="flex-1 overflow-auto bg-muted/30">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
            <h1 className="text-lg font-semibold">Admin</h1>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
            </Button>
        </header>
        {children}
      </main>
    </div>
  );
}
