
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, writeBatch, getDoc } from "firebase/firestore";
import { CartItem, Product } from '@/lib/types';
import { useToast } from './use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_STORAGE_KEY = 'cart-id';

function getOrCreateCartId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
    if (!cartId) {
      cartId = doc(collection(db, 'carts')).id;
      localStorage.setItem(CART_ID_STORAGE_KEY, cartId);
    }
    return cartId;
  } catch (error) {
    console.error("Failed to access localStorage:", error);
    return doc(collection(db, 'carts')).id;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setCartId(getOrCreateCartId());
  }, []);

  useEffect(() => {
    if (!cartId) {
        setLoading(false);
        return;
    };
    
    const cartItemsCollection = collection(db, "carts", cartId, "items");
    const unsubscribe = onSnapshot(cartItemsCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
      setCartItems(items);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching cart items:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [cartId]);

  const addToCart = useCallback(async (product: Product) => {
    if (!cartId) return;

    const productRef = doc(db, "products", product.id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists() || productSnap.data().stock === 0) {
        toast({
            variant: "destructive",
            title: "Out of Stock",
            description: `${product.name} is currently unavailable.`,
        });
        return;
    }
    
    const currentStock = productSnap.data().stock;
    const existingItem = cartItems.find(item => item.id === product.id);
    const newQuantity = (existingItem?.quantity || 0) + 1;

    if (newQuantity > currentStock) {
        toast({
            variant: "destructive",
            title: "Stock Limit Reached",
            description: `You cannot add more of ${product.name}.`,
        });
        return;
    }
    
    const itemRef = doc(db, "carts", cartId, "items", product.id);
    await writeBatch(db).set(itemRef, { ...product, quantity: newQuantity }).commit();

  }, [cartId, cartItems, toast]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (!cartId) return;
    const itemRef = doc(db, "carts", cartId, "items", productId);
    await writeBatch(db).delete(itemRef).commit();
  }, [cartId]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!cartId) return;
    const itemRef = doc(db, "carts", cartId, "items", productId);
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    await writeBatch(db).set(itemRef, { quantity }, { merge: true }).commit();
  }, [cartId, removeFromCart]);

  const clearCart = useCallback(async () => {
     if (!cartId) return;
    const cartItemsCollection = collection(db, "carts", cartId, "items");
    const batch = writeBatch(db);
    cartItems.forEach(item => {
        const itemRef = doc(cartItemsCollection, item.id);
        batch.delete(itemRef);
    });
    await batch.commit();
  }, [cartId, cartItems]);
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice, loading };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
