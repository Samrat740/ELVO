
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, ShoppingCart, Home } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const navItems = [
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, isAdmin, loading } = useAuth();
  const router = useRouter();

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
      <aside className="w-64 flex-shrink-0 border-r bg-background">
        <div className="flex h-full flex-col">
          <div className="p-4">
             <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
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
             <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted">
                <Home className="h-5 w-5" />
                Back to Store
             </Link>
           </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-muted/30">{children}</main>
    </div>
  );
}
