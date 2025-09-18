
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { Order, OrderStatus } from '@/lib/types';
import { useAuth } from './use-auth';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const ordersCollection = collection(db, "orders");
    let q;

    if (isAdmin) {
      // Admins can see all orders
      q = query(ordersCollection, orderBy("createdAt", "desc"));
    } else {
      // Regular users only see their own orders
      q = query(ordersCollection, where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, isAdmin]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    if (!isAdmin) {
      console.error("Only admins can update order status.");
      return;
    }
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
  }, [isAdmin]);

  const value = { orders, loading, updateOrderStatus };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
