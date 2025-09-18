
"use client";

import { useOrders } from "@/hooks/use-orders";
import { format } from 'date-fns';
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
          <div className="hidden md:flex bg-muted/50 font-medium px-6 py-3 text-sm text-muted-foreground">
            <div className="w-24 flex-shrink-0">Order ID</div>
            <div className="flex-1">Customer</div>
            <div className="flex-1">Date</div>
            <div className="flex-1">Status</div>
            <div className="w-32 text-right">Total</div>
            <div className="w-16 text-center">Details</div>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {orders.map((order) => (
              <AccordionItem value={order.id} key={order.id} className="border-b">
                <AccordionTrigger className="flex flex-col md:flex-row items-start md:items-center w-full px-6 py-4 text-left hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex w-full md:w-auto items-center mb-2 md:mb-0">
                    <div className="md:w-24 md:flex-shrink-0 font-mono text-sm text-muted-foreground">{order.id.substring(0, 6)}...</div>
                    <div className="md:hidden flex-1 text-right font-medium">₹{order.total.toFixed(2)}</div>
                  </div>
                  <div className="flex-1 md:flex items-center w-full">
                    <div className="md:flex-1 mb-2 md:mb-0">{order.shippingInfo.name}</div>
                    <div className="md:flex-1 mb-2 md:mb-0">
                      {order.createdAt ? format(order.createdAt.toDate(), 'PPP') : 'N/A'}
                    </div>
                    <div className="md:flex-1">
                      <Select onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)} defaultValue={order.status}>
                        <SelectTrigger className="w-32 h-9" onClick={(e) => e.stopPropagation()}>
                            <SelectValue placeholder="Set Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="w-32 text-right font-medium hidden md:block">₹{order.total.toFixed(2)}</div>
                  <div className="w-16 text-center hidden md:block pl-7">
                    {/* The trigger icon is now part of the AccordionTrigger */}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/20">
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
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
