"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks/use-products.tsx';
import { useCart } from '@/hooks/use-cart.tsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useMemo } from 'react';

export default function Home() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();

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
            <Link href="#featured">
              Explore The Collection <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Featured Collection</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
                   <div className="absolute top-3 right-3">
                    <Button size="icon" className="rounded-full h-10 w-10 bg-black/50 text-white hover:bg-primary hover:text-primary-foreground backdrop-blur-sm border-none" onClick={() => handleAddToCart(product)}>
                      <ShoppingBag className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="flex-1 p-4 bg-card">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold leading-tight hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4 pt-0 bg-card">
                  <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
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
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl md:text-4xl font-headline">Join The #ELVOStyle</h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">Follow us on social media for style inspiration and new arrivals.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Button variant="outline">Instagram</Button>
              <Button variant="outline">Pinterest</Button>
              <Button variant="outline">Facebook</Button>
            </div>
        </div>
      </section>
    </div>
  );
}
