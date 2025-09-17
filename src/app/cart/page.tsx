"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, cartCount } = useCart();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">Your Cart</h1>
      {cartCount === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
             <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild className="mt-6">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="flex items-center p-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="aspect-square rounded-md object-cover"
                    data-ai-hint={item.imageHint}
                  />
                  <div className="ml-4 flex-1">
                    <Link href={`/products/${item.id}`} className="font-semibold hover:text-primary">{item.name}</Link>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    <div className="mt-2 flex items-center">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="h-8 w-14 text-center mx-2"
                      />
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                     <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button variant="ghost" size="icon" className="mt-2 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="lg:col-span-1 sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
               <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
