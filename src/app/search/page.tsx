
"use client";

import { useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { ShoppingBag, SearchX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

function SearchResults() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  
  const searchQuery = searchParams.get('q');

  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return [];
    }
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      action: (
        <Button asChild variant="link" className="text-white">
          <Link href="/cart">View cart</Link>
        </Button>
      )
    });
  };
  
  if (!searchQuery) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center h-[400px]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Search for products</h2>
            <p className="mt-2 text-sm text-muted-foreground">Use the search bar above to find what you're looking for.</p>
        </div>
    )
  }

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-headline tracking-tight mb-8">
        Search results for "{searchQuery}"
      </h1>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group flex flex-col overflow-hidden rounded-lg border-none bg-card shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={product.imageHint}
                  />
                </Link>
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {product.stock > 0 && (
                    <Button size="icon" className="rounded-full h-10 w-10 bg-black/50 text-white hover:bg-primary hover:text-primary-foreground backdrop-blur-sm border-none" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
                        <ShoppingBag className="h-5 w-5" />
                    </Button>
                    )}
                </div>
                {product.stock <= 0 && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="destructive" className="text-base font-bold uppercase tracking-wider">Out of Stock</Badge>
                  </div>
                )}
                 {product.stock > 0 && product.hasDiscount && product.discountPercentage && (
                  <div className="absolute top-3 left-3">
                      <Badge className="text-base font-bold uppercase tracking-wider bg-destructive text-destructive-foreground">{Math.round(product.discountPercentage)}% OFF</Badge>
                  </div>
                  )}
              </div>
              <CardContent className="flex-1 p-4 bg-card">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold leading-tight hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0 bg-card">
                {product.hasDiscount && product.originalPrice ? (
                      <div className="flex items-baseline gap-2">
                          <p className="text-xl font-bold text-destructive">₹{product.price.toFixed(2)}</p>
                          <p className="text-sm font-medium text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</p>
                      </div>
                  ) : (
                      <p className="text-xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
                  )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center h-[400px]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <SearchX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No products found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your search for "{searchQuery}" did not match any products.</p>
             <Button asChild className="mt-6">
              <Link href="/products">View all products</Link>
            </Button>
        </div>
      )}
    </>
  );
}


export default function SearchPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <Suspense fallback={<div>Loading search results...</div>}>
                <SearchResults />
            </Suspense>
        </div>
    )
}
