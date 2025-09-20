
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, writeBatch, increment, getDoc } from "firebase/firestore";
import { WishlistItem, Product } from '@/lib/types';
import { useAuth } from './use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!currentUser) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    const wishlistCollection = collection(db, "wishlists", currentUser.uid, "items");
    const unsubscribe = onSnapshot(wishlistCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WishlistItem));
      setWishlistItems(items);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching wishlist items:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, authLoading]);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const toggleWishlist = useCallback(async (product: Product) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    const batch = writeBatch(db);
    const productRef = doc(db, "products", product.id);
    const wishlistItemRef = doc(db, "wishlists", currentUser.uid, "items", product.id);

    const isCurrentlyInWishlist = isInWishlist(product.id);

    if (isCurrentlyInWishlist) {
      // Remove from wishlist
      batch.delete(wishlistItemRef);
      batch.update(productRef, { wishlistCount: increment(-1) });
      toast({ title: "Removed from wishlist", description: `${product.name} has been removed from your wishlist.` });
    } else {
      // Add to wishlist
      const { id, ...productDetails } = product;
      batch.set(wishlistItemRef, productDetails);
      batch.update(productRef, { wishlistCount: increment(1) });
      toast({ title: "Added to wishlist", description: `${product.name} has been added to your wishlist.` });
    }
    
    await batch.commit();

  }, [currentUser, router, isInWishlist, toast]);

  const value = { wishlistItems, isInWishlist, toggleWishlist, loading };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
