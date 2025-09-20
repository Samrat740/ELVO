

"use client";

import { useOrders } from "@/hooks/use-orders";
import { format } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Truck, ClipboardCopy, XCircle, Package, CheckCircle } from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";
import { Order, OrderStatus } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const OrderList = ({
  orders,
  handleStatusChange,
  handleCopyToClipboard,
  listType = 'active',
}: {
  orders: Order[];
  handleStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  handleCopyToClipboard: (text: string) => void;
  listType?: 'active' | 'shipped' | 'delivered' | 'cancelled';
}) => {
  return (
    <div className="rounded-lg border">
        <div className="hidden md:grid grid-cols-[1fr,1fr,1fr,1fr,auto,auto] items-center bg-muted/50 font-medium px-6 py-3 text-sm text-muted-foreground">
          <div className="flex-shrink-0">Order ID</div>
          <div className="flex-1">Customer</div>
          <div className="flex-1">Date</div>
          <div className="flex-1">Status</div>
          <div className="w-32 text-right">Total</div>
          <div className="w-16 text-center">Details</div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {orders.map((order) => (
            <AccordionItem value={order.id} key={order.id} className="border-b">
              <div className="flex items-center w-full px-6 py-4 hover:bg-muted/50 transition-colors">
                <div className="hidden md:grid grid-cols-[1fr,1fr,1fr,1fr,auto] items-center w-full">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs text-muted-foreground truncate" title={order.id}>{order.id}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyToClipboard(order.id)}>
                          <ClipboardCopy className="h-4 w-4"/>
                      </Button>
                  </div>
                  <div className="flex-1">{order.shippingInfo.name}</div>
                  <div className="flex-1">
                    {order.createdAt ? format(order.createdAt.toDate(), 'PPP') : 'N/A'}
                  </div>
                    <div className="flex-1">
                      {listType === 'cancelled' || listType === 'delivered' ? (
                          <Badge variant={listType === 'cancelled' ? 'destructive' : 'success'}>{order.status}</Badge>
                      ) : (
                        <Select onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)} defaultValue={order.status}>
                          <SelectTrigger className="w-36 h-9">
                              <SelectValue placeholder="Set Status" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Confirmed">Confirmed</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                               <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                      Mark as Delivered
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Marking this order as delivered is a final action. Please ensure the order has been successfully delivered before proceeding.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Back</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleStatusChange(order.id, 'Delivered')}>Yes, Mark as Delivered</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                               <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive focus:text-destructive">
                                      Cancel Order
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will cancel the order and move it to the cancelled tab. This action cannot be undone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Back</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleStatusChange(order.id, 'Cancelled')} className="bg-destructive hover:bg-destructive/90">Yes, Cancel Order</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                          </SelectContent>
                        </Select>
                      )}
                  </div>
                  <div className="w-32 text-right font-medium">₹{order.total.toFixed(2)}</div>
                </div>
                {/* Mobile view structure */}
                <div className="md:hidden flex flex-col w-full">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-1">
                              <p className="font-mono text-xs text-muted-foreground break-all">{order.id}</p>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyToClipboard(order.id)}>
                                  <ClipboardCopy className="h-3 w-3"/>
                              </Button>
                          </div>
                          <p className="font-medium">{order.shippingInfo.name}</p>
                          <p className="text-sm text-muted-foreground">
                              {order.createdAt ? format(order.createdAt.toDate(), 'PPP') : 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">₹{order.total.toFixed(2)}</p>
                        </div>
                    </div>
                     {listType === 'cancelled' || listType === 'delivered' ? (
                          <Badge variant={listType === 'cancelled' ? 'destructive' : 'success'} className="w-fit">{order.status}</Badge>
                      ) : (
                        <Select onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)} defaultValue={order.status}>
                          <SelectTrigger className="w-40 h-9 mt-2">
                              <SelectValue placeholder="Set Status" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Confirmed">Confirmed</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                               <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                      Mark as Delivered
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                       Marking this order as delivered is a final action. Please ensure the order has been successfully delivered before proceeding.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Back</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleStatusChange(order.id, 'Delivered')}>Yes, Mark as Delivered</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive focus:text-destructive">
                                      Cancel Order
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will cancel the order and move it to the cancelled tab. This action cannot be undone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Back</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleStatusChange(order.id, 'Cancelled')} className="bg-destructive hover:bg-destructive/90">Yes, Cancel Order</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                          </SelectContent>
                        </Select>
                      )}
                </div>
                
                  <AccordionTrigger className="w-16 justify-center p-0 hover:no-underline pl-7 self-start md:self-center mt-2 md:mt-0">
                  {/* The trigger icon is now separate */}
                </AccordionTrigger>
              </div>
              <AccordionContent>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/20">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Shipping & Contact</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{order.shippingInfo.name}</p>
                        <p>{order.shippingInfo.address}</p>
                        <p>{order.shippingInfo.city}, {order.shippingInfo.zip}</p>
                        <p className="mt-2 font-medium">Contact Details:</p>
                        <p>{order.shippingInfo.email}</p>
                        <p>{order.shippingInfo.phone}</p>
                        {order.shippingInfo.altPhone && <p>{order.shippingInfo.altPhone} (Alt)</p>}
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
                                    <p className="font-mono text-xs text-muted-foreground" title={item.id}>ID: {item.id}</p>
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
  )
}

const EmptyState = ({icon: Icon, title, description}: {icon: React.ElementType, title: string, description: string}) => (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
);


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
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard",
        description: "Order ID has been copied."
    })
  }

  const { confirmedOrders, shippedOrders, deliveredOrders, cancelledOrders } = useMemo(() => {
    return orders.reduce((acc, order) => {
      switch (order.status) {
        case 'Confirmed':
          acc.confirmedOrders.push(order);
          break;
        case 'Shipped':
          acc.shippedOrders.push(order);
          break;
        case 'Delivered':
          acc.deliveredOrders.push(order);
          break;
        case 'Cancelled':
          acc.cancelledOrders.push(order);
          break;
      }
      return acc;
    }, { 
      confirmedOrders: [] as Order[], 
      shippedOrders: [] as Order[],
      deliveredOrders: [] as Order[],
      cancelledOrders: [] as Order[] 
    });
  }, [orders]);


  if (loading) {
    return <div className="p-8">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Customer Orders</h1>
      
      <Tabs defaultValue="new">
        <TabsList className="mb-6 grid w-full grid-cols-1 md:grid-cols-4 h-auto md:h-10">
          <TabsTrigger value="new">New ({confirmedOrders.length})</TabsTrigger>
          <TabsTrigger value="shipped">Shipped ({shippedOrders.length})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({deliveredOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          {confirmedOrders.length === 0 ? (
            <EmptyState icon={Package} title="No new orders" description="New confirmed orders will appear here." />
          ) : (
            <OrderList orders={confirmedOrders} handleStatusChange={handleStatusChange} handleCopyToClipboard={handleCopyToClipboard} listType="active" />
          )}
        </TabsContent>
         <TabsContent value="shipped">
          {shippedOrders.length === 0 ? (
            <EmptyState icon={Truck} title="No shipped orders" description="Orders marked as shipped will be listed here." />
          ) : (
            <OrderList orders={shippedOrders} handleStatusChange={handleStatusChange} handleCopyToClipboard={handleCopyToClipboard} listType="shipped" />
          )}
        </TabsContent>
         <TabsContent value="delivered">
          {deliveredOrders.length === 0 ? (
            <EmptyState icon={CheckCircle} title="No delivered orders" description="Completed orders will be shown here." />
          ) : (
            <OrderList orders={deliveredOrders} handleStatusChange={handleStatusChange} handleCopyToClipboard={handleCopyToClipboard} listType="delivered" />
          )}
        </TabsContent>
        <TabsContent value="cancelled">
           {cancelledOrders.length === 0 ? (
            <EmptyState icon={XCircle} title="No cancelled orders" description="Cancelled orders will be listed here." />
          ) : (
            <OrderList orders={cancelledOrders} handleStatusChange={handleStatusChange} handleCopyToClipboard={handleCopyToClipboard} listType="cancelled" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
