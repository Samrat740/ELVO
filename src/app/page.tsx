"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks/use-products';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';

export default function Home() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Discover Your Style</h1>
        <p className="mt-4 text-lg text-muted-foreground">Curated home decor for the modern nest.</p>
      </div>

      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for products..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group flex flex-col overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-xl">
              <CardHeader className="p-0">
                <Link href={`/products/${product.id}`} className="block overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={product.imageHint}
                  />
                </Link>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <Link href={`/products/${product.id}`}>
                  <CardTitle className="text-lg font-semibold leading-tight hover:text-primary transition-colors">{product.name}</CardTitle>
                </Link>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <p className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</p>
                <Button onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found for "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
}
