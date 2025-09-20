
"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';


export default function ProductsPage() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const selectedCategory = searchParams.get('category');
  const selectedAudience = searchParams.get('audience');
  const searchQuery = searchParams.get('q');

  const filteredProducts = useMemo(() => {
    let tempProducts = products;
    
    if (selectedCategory) {
      tempProducts = tempProducts.filter(p => p.category === selectedCategory);
    }
    
    if (selectedAudience) {
      const audienceFilter = selectedAudience === 'Men' ? 'For Him' : 'For Her';
      tempProducts = tempProducts.filter(p => p.audience === audienceFilter);
    }

    if (searchQuery) {
      tempProducts = tempProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return tempProducts;
  }, [products, selectedCategory, selectedAudience, searchQuery]);

  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);
  
  const audiences = useMemo(() => {
     const audienceSet = new Set(products.map(p => p.audience === 'For Him' ? 'Men' : 'Women'));
     return [...audienceSet];
  }, [products]);

  const handleFilterChange = (type: 'category' | 'audience', value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
        params.delete(type);
    } else {
        params.set(type, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

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

  const getPageTitle = () => {
    if (selectedCategory) return selectedCategory;
    if (selectedAudience) return selectedAudience;
    return 'All Products';
  }

  return (
    <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-headline tracking-tight">
                {getPageTitle()}
            </h1>
            <div className="flex gap-4">
                 <div className="w-40">
                    <Select onValueChange={(value) => handleFilterChange('category', value)} value={selectedCategory || 'all'}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="w-40">
                    <Select onValueChange={(value) => handleFilterChange('audience', value)} value={selectedAudience || 'all'}>
                        <SelectTrigger>
                            <SelectValue placeholder="For" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">For Everyone</SelectItem>
                            {audiences.map(audience => (
                                <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
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
      {filteredProducts.length === 0 && (
         <div className="text-center col-span-full py-16">
            <h2 className="text-2xl font-semibold">No products found</h2>
            <p className="mt-2 text-muted-foreground">Try adjusting your filters or check back later.</p>
         </div>
      )}
    </div>
  );
}
