
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/types';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

export default function WishlistPage() {
  const { wishlistItems, loading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading || authLoading) {
    return <div className="container mx-auto py-12 px-4 text-center">Loading your wishlist...</div>;
  }
  
  if (!currentUser) {
     return null;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">Looks like you haven't added anything to your wishlist yet.</p>
          <Button asChild className="mt-6">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
          {wishlistItems.map((product) => (
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
                  <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 bg-black/50 text-white hover:bg-primary backdrop-blur-sm border-none text-red-500 hover:text-red-600" onClick={() => toggleWishlist(product)}>
                      <Trash2 className="h-5 w-5" />
                  </Button>
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
      )}
    </div>
  );
}
