
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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | undefined | null>(undefined);

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      setProduct(foundProduct ?? null);
    }
  }, [getProductById, id]);

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
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all products
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div className="overflow-hidden rounded-lg shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={800}
            height={800}
            className="aspect-square w-full object-cover"
            data-ai-hint={product.imageHint}
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <p className="text-3xl font-bold text-foreground">₹{product.price.toFixed(2)}</p>
            {product.stock === 0 && (
                <Badge variant="destructive" className="text-base font-medium">Out of Stock</Badge>
            )}
          </div>
          <p className="mt-6 text-base text-muted-foreground">{product.description}</p>
          <div className="mt-8">
            <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
