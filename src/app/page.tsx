
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks/use-products.tsx';
import { useCart } from '@/hooks/use-cart.tsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { ArrowRight, ShoppingBag, XCircle, Instagram, Megaphone } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const featuredProducts = products.filter(p => p.featured);
  
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  const categoryProducts = useMemo(() => {
    return categories.map(category => {
      return products.find(p => p.category === category);
    }).filter((p): p is Product => p !== undefined);
  }, [products, categories]);


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

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="https://picsum.photos/seed/hero-bags/1800/1200"
          alt="Stylish bags collection"
          fill
          className="object-cover object-center brightness-[.4]"
          data-ai-hint="classy handbags"
          priority
        />
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline tracking-tight text-shadow-lg">
            Carry More Than a Bag, Carry a Statement.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-shadow leading-relaxed text-gray-200">
            ELVO is not just about accessories; it's about identity. We craft premium, Pinterest-worthy bags, wallets, and more for the modern individual who values style, quality, and self-expression.
          </p>
          <Button asChild size="lg" className="mt-8 group bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/products">
              Explore The Collection <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Featured Collection</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
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
                  {product.hasDiscount && product.discountPercentage && product.stock > 0 && (
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
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product) => (
               <Link href={`/products?category=${product.category}`} key={product.id} className="relative aspect-square md:aspect-[4/5] group overflow-hidden rounded-xl shadow-md">
                    <Image
                      src={product.imageUrl}
                      alt={product.category}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110 brightness-75"
                      data-ai-hint={product.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-headline text-white tracking-tight">{product.category}</h3>
                    </div>
                </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
       <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="relative text-center bg-muted/40 rounded-2xl border border-border/50 px-6 py-12 overflow-hidden">
             <div className="absolute -top-4 -right-4 h-24 w-24 text-primary/10">
                <Megaphone className="h-full w-full" />
            </div>
             <div className="absolute -bottom-6 -left-6 h-28 w-28 text-primary/10">
                <Instagram className="h-full w-full" />
            </div>
            <div className="relative">
                <h2 className="text-3xl md:text-4xl font-headline flex items-center justify-center gap-2">
                    Join The #ELVOStyle
                </h2>
                <p className="mt-4 max-w-xl mx-auto text-muted-foreground">Follow our journey and be the first to see new arrivals, style inspiration, and behind-the-scenes content on our social media.</p>
                <div className="mt-8 flex justify-center gap-4">
                  <Button variant="outline" className="bg-background">Instagram</Button>
                  <Button variant="outline" className="bg-background">Pinterest</Button>
                  <Button variant="outline" className="bg-background">Facebook</Button>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
