
"use client";

import Link from 'next/link';
import { useOrders } from "@/hooks/use-orders";
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function OrdersPage() {
  const { orders, loading, updateOrderStatus } = useOrders();
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);
  
  const handleCancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'Cancelled');
      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled.",
      });
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: "Could not cancel the order. Please contact support.",
      });
    }
  };

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'default';
      case 'Shipped':
        return 'secondary';
      case 'Delivered':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (loading || authLoading) {
    return <div className="container mx-auto py-12 px-4 text-center">Loading your orders...</div>;
  }
  
  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">You haven't placed any orders yet.</h2>
            <p className="mt-2 text-sm text-muted-foreground">When you place an order, it will appear here.</p>
             <Button asChild className="mt-6">
              <Link href="/">Start Shopping</Link>
            </Button>
        </div>
      ) : (
        <>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row justify-between items-start pb-4">
                            <div>
                                <p className="font-semibold">Order ID</p>
                                <p className="font-mono text-sm text-muted-foreground">{order.id.substring(0, 8)}...</p>
                            </div>
                             <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Date</span>
                                <span>{order.createdAt ? format(order.createdAt.toDate(), 'PPP') : 'N/A'}</span>
                            </div>
                            <Separator />
                             {order.status === 'Confirmed' && (
                                <div className="pt-2">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-full">
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Cancel Order
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will cancel your order. This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Back</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleCancelOrder(order.id)} className="bg-destructive hover:bg-destructive/90">Yes, Cancel</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                            )}
                            <div>
                                <h4 className="font-semibold mb-3">Items</h4>
                                <div className="flex items-start flex-wrap gap-4">
                                {order.items.map(item => (
                                <Link href={`/products/${item.id}`} key={item.id} className="flex flex-col items-center text-center gap-1 group w-16">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        width={64}
                                        height={64}
                                        className="rounded-md object-cover aspect-square transition-transform group-hover:scale-105"
                                    />
                                    <span className="text-xs text-muted-foreground w-full truncate group-hover:text-primary">{item.name}</span>
                                </Link>
                                ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-4 flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block rounded-lg border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-32">Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center w-36">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-mono text-sm text-muted-foreground">{order.id.substring(0, 8)}...</TableCell>
                            <TableCell>
                            {order.createdAt ? format(order.createdAt.toDate(), 'PPP') : 'N/A'}
                            </TableCell>
                            <TableCell>
                            <div className="flex items-start flex-wrap gap-4">
                                {order.items.map(item => (
                                <Link href={`/products/${item.id}`} key={item.id} className="flex flex-col items-center text-center gap-1 group">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className="rounded-md object-cover aspect-square transition-transform group-hover:scale-105"
                                    />
                                    <span className="text-xs text-muted-foreground w-16 truncate group-hover:text-primary">{item.name}</span>
                                </Link>
                                ))}
                            </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">₹{order.total.toFixed(2)}</TableCell>
                            <TableCell className="text-center">
                                {order.status === 'Confirmed' && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        Cancel Order
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will cancel your order. This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Back</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleCancelOrder(order.id)} className="bg-destructive hover:bg-destructive/90">Yes, Cancel</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </>
      )}
    </div>
  );
}
