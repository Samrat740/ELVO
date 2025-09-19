
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function WishlistPage() {
  const { currentUser } = useAuth();
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from Wishlist",
      description: `${productName} has been removed.`,
    });
  };
  
  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    toast({
      title: "Moved to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return <div className="container mx-auto py-12 px-4 text-center">Loading your wishlist...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">My Wishlist</h1>
      {!currentUser ? (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
             <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Log in to see your wishlist</h2>
          <p className="mt-2 text-sm text-muted-foreground">Create an account or log in to save your favorite items.</p>
          <Button asChild className="mt-6">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      ) : wishlist.length === 0 ? (
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((product) => (
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
                {product.stock <= 0 && (
                    <div className="absolute top-3 left-3">
                        <Badge variant="destructive" className="text-base font-bold uppercase tracking-wider">Out of Stock</Badge>
                    </div>
                )}
                {product.hasDiscount && product.discountPercentage && (
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
                 {product.hasDiscount && product.originalPrice ? (
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-xl font-bold text-destructive">₹{product.price.toFixed(2)}</p>
                            <p className="text-sm font-medium text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</p>
                        </div>
                    ) : (
                        <p className="text-xl font-bold text-primary mt-2">₹{product.price.toFixed(2)}</p>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2 p-4 pt-0 bg-card">
                   <Button className="w-full" onClick={() => handleMoveToCart(product)} disabled={product.stock === 0}>
                        <ShoppingBag className="mr-2 h-4 w-4"/>
                        {product.stock > 0 ? 'Move to Cart' : 'Out of Stock'}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleRemoveFromWishlist(product.id, product.name)}>
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Remove
                    </Button>
                </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

