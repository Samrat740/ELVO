
"use client";

import { useRedirect } from "@/hooks/use-redirect";

export default function AdminRootPage() {
  // Redirect to the products page by default
  useRedirect("/admin/products");
  
  return (
    <div className="container mx-auto py-12 px-4 text-center">
        Redirecting...
    </div>
  );
}
