
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, writeBatch, getDoc, getDocs } from "firebase/firestore";
import { CartItem, Product } from '@/lib/types';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { useRouter } from 'next/navigation';

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

const ANONYMOUS_CART_ID_STORAGE_KEY = 'anonymous-cart-id';

function getOrCreateAnonymousCartId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let cartId = localStorage.getItem(ANONYMOUS_CART_ID_STORAGE_KEY);
    if (!cartId) {
      cartId = doc(collection(db, 'carts')).id;
      localStorage.setItem(ANONYMOUS_CART_ID_STORAGE_KEY, cartId);
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
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const mergeAnonymousCart = useCallback(async (userId: string) => {
    const anonymousCartId = localStorage.getItem(ANONYMOUS_CART_ID_STORAGE_KEY);
    if (!anonymousCartId) return;

    const anonCartItemsRef = collection(db, "carts", anonymousCartId, "items");
    const userCartItemsRef = collection(db, "carts", userId, "items");
    
    const anonCartSnapshot = await getDocs(anonCartItemsRef);
    if (anonCartSnapshot.empty) {
        localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY);
        return;
    }

    const batch = writeBatch(db);

    for (const itemDoc of anonCartSnapshot.docs) {
        const itemData = itemDoc.data() as CartItem;
        const userCartItemRef = doc(userCartItemsRef, itemDoc.id);

        // Simple merge: overwrite or add. A more complex logic could sum quantities.
        batch.set(userCartItemRef, itemData, { merge: true });
        
        // Delete item from anonymous cart
        batch.delete(itemDoc.ref);
    }

    await batch.commit();
    localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY);
    console.log("Anonymous cart merged and deleted.");

  }, []);

  useEffect(() => {
    if (authLoading) {
        setLoading(true);
        return;
    }

    let activeCartId: string;

    if (currentUser) {
        mergeAnonymousCart(currentUser.uid);
        activeCartId = currentUser.uid;
    } else {
        // We still need to listen to the anonymous cart to display count if needed,
        // but adding to it will trigger a login redirect.
        activeCartId = getOrCreateAnonymousCartId();
    }
    setCartId(activeCartId);
    
    if (!activeCartId) {
        setLoading(false);
        return;
    }
    
    const cartItemsCollection = collection(db, "carts", activeCartId, "items");
    const unsubscribe = onSnapshot(cartItemsCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
      setCartItems(items);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching cart items:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, authLoading, mergeAnonymousCart]);

  const addToCart = useCallback(async (product: Product) => {
    if (!currentUser) {
        router.push('/login');
        return;
    }
    
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
    
    const { id, ...productDetails } = product;

    const itemPayload = { 
      ...productDetails, 
      quantity: newQuantity,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl
    };
    
    if (product.hasDiscount && product.originalPrice) {
      itemPayload.originalPrice = product.originalPrice;
      itemPayload.discountPercentage = product.discountPercentage;
    }


    await writeBatch(db).set(itemRef, itemPayload, { merge: true }).commit();
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });

  }, [cartId, cartItems, toast, currentUser, router]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (!cartId) return;
    const itemRef = doc(db, "carts", cartId, "items", productId);
    await writeBatch(db).delete(itemRef).commit();
  }, [cartId]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!cartId) return;
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        toast({
            variant: "destructive",
            title: "Product not found",
            description: "This product is no longer available.",
        });
        removeFromCart(productId);
        return;
    }

    const currentStock = productSnap.data().stock;

    if (quantity > currentStock) {
        toast({
            variant: "destructive",
            title: "Stock Limit Reached",
            description: `Only ${currentStock} items are available.`,
        });
        quantity = currentStock;
    }

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const itemRef = doc(db, "carts", cartId, "items", productId);
    await writeBatch(db).set(itemRef, { quantity }, { merge: true }).commit();
  }, [cartId, removeFromCart, toast]);

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
