
"use client";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Truck } from "lucide-react";
import Image from "next/image";
import React from "react";
import { OrderStatus } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function OrdersPage() {
  const { orders, loading, updateOrderStatus } = useOrders();
  const { toast } = useToast();

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update order status.",
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
      default:
        return 'default';
    }
  };

  if (loading) {
    return <div className="p-8">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Customer Orders</h1>
      
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Truck className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Accordion type="single" collapsible className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-16 text-center">Details</TableHead>
                </TableRow>
              </TableHeader>
                {orders.map((order) => (
                  <TableBody key={order.id}>
                    <AccordionItem value={order.id} asChild>
                      <>
                        <TableRow>
                          <TableCell className="font-mono text-sm text-muted-foreground">{order.id.substring(0, 6)}...</TableCell>
                          <TableCell>{order.shippingInfo.name}</TableCell>
                          <TableCell>
                            {order.createdAt ? format(order.createdAt.toDate(), 'PPP') : 'N/A'}
                          </TableCell>
                          <TableCell>
                             <Select onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)} defaultValue={order.status}>
                                <SelectTrigger className="w-32 h-9">
                                    <SelectValue placeholder="Set Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                </SelectContent>
                             </Select>
                          </TableCell>
                          <TableCell className="text-right font-medium">₹{order.total.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <AccordionTrigger className="p-2 [&>svg]:h-5 [&>svg]:w-5"></AccordionTrigger>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={6} className="p-0">
                            <AccordionContent>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/50">
                                  <div className="space-y-4">
                                    <h4 className="font-semibold">Shipping Address</h4>
                                    <div className="text-sm text-muted-foreground">
                                      <p>{order.shippingInfo.name}</p>
                                      <p>{order.shippingInfo.address}</p>
                                      <p>{order.shippingInfo.city}, {order.shippingInfo.zip}</p>
                                      <p>{order.shippingInfo.email}</p>
                                    </div>
                                  </div>
                                  <div className="md:col-span-2 space-y-4">
                                    <h4 className="font-semibold">Items</h4>
                                    <div className="space-y-3">
                                      {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between items-center">
                                          <div className="flex items-center gap-3">
                                              {item.imageUrl && (
                                                <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="rounded-md object-cover"/>
                                              )}
                                              <div>
                                                  <p className="font-medium">{item.name}</p>
                                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                              </div>
                                          </div>
                                          <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                            </AccordionContent>
                          </TableCell>
                        </TableRow>
                      </>
                    </AccordionItem>
                  </TableBody>
                ))}
            </Table>
          </Accordion>
        </div>
      )}
    </div>
  );
}
