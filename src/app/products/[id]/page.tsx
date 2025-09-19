
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useProducts } from '@/hooks/use-products.tsx';
import { useCart } from '@/hooks/use-cart.tsx';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { type Product } from '@/lib/types';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useWishlist } from '@/hooks/use-wishlist';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | undefined | null>(undefined);

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      setProduct(foundProduct ?? null);
    }
  }, [getProductById, id]);
  
  const isInWishlist = product ? wishlist.some(item => item.id === product.id) : false;

  const handleWishlistToggle = () => {
    if (!product) return;
    if (!currentUser) {
      toast({ variant: "destructive", title: "Login Required", description: "You need to be logged in to manage your wishlist." });
      return;
    }
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from Wishlist", description: `${product.name} has been removed from your wishlist.` });
    } else {
      addToWishlist(product);
      toast({ title: "Added to Wishlist", description: `${product.name} has been added to your wishlist.` });
    }
  };

  const handleShare = async () => {
    if (product && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
        toast({ title: "Shared successfully!" });
      } catch (error: any) {
        // Don't show an error if the user cancels the share dialog
        if (error.name === 'AbortError') {
          console.log('Share was aborted by the user.');
          return;
        }
        console.error('Error sharing:', error);
        toast({
          variant: "destructive",
          title: "Could not share",
          description: "Something went wrong while trying to share.",
        });
      }
    } else {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied!", description: "Product link copied to clipboard." });
    }
  };


  if (product === undefined) {
    return <ProductDetailSkeleton />;
  }

  if (product === null) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <p className="text-muted-foreground">The product you're looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all products
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={800}
            height={800}
            className="aspect-square w-full object-cover"
            data-ai-hint={product.imageHint}
          />
           {product.hasDiscount && product.discountPercentage && (
            <div className="absolute top-4 left-4">
                <Badge className="text-lg font-bold uppercase tracking-wider bg-destructive text-destructive-foreground">{Math.round(product.discountPercentage)}% OFF</Badge>
            </div>
            )}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4">
             {product.hasDiscount && product.originalPrice && product.discountPercentage ? (
                <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-destructive">₹{product.price.toFixed(2)}</p>
                    <p className="text-xl font-medium text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</p>
                    <Badge variant="destructive" className="text-base">{Math.round(product.discountPercentage)}% off</Badge>
                </div>
            ) : (
                <p className="text-3xl font-bold text-foreground">₹{product.price.toFixed(2)}</p>
            )}
            {product.stock === 0 && (
                <Badge variant="destructive" className="text-base font-medium">Out of Stock</Badge>
            )}
          </div>
          <p className="mt-6 text-base text-muted-foreground">{product.description}</p>
          <div className="mt-8 flex gap-2">
            <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            {currentUser && (
               <Button size="lg" variant="outline" onClick={handleWishlistToggle}>
                  <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  {isInWishlist ? 'Wishlisted' : 'Wishlist'}
              </Button>
            )}
             <Button size="lg" variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-5 w-5" />
                Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
       <div className="mb-8">
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="flex flex-col justify-center space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
          <div className="pt-4">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
