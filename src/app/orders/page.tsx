
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
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/lib/types';
import Image from 'next/image';

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'default';
      case 'Shipped':
        return 'secondary';
      case 'Delivered':
        return 'outline';
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
        <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
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
                    </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
      )}
    </div>
  );
}
