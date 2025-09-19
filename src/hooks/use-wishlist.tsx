
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, getDocs, deleteDoc, setDoc } from "firebase/firestore";
import { Product, WishlistItem, MostWishedForItem } from '@/lib/types';
import { useAuth } from './use-auth';
import { useProducts } from './use-products';

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  mostWishedFor: MostWishedForItem[];
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, isAdmin } = useAuth();
  const { products: allProducts, loading: productsLoading } = useProducts();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [mostWishedFor, setMostWishedFor] = useState<MostWishedForItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    setLoading(true);

    if (isAdmin) {
      // Admin Logic: Fetch "Most Wished For"
      if (!productsLoading) { // Only run if products are loaded
        const fetchAdminData = async () => {
          try {
            const allWishlistsSnapshot = await getDocs(collection(db, "wishlists"));
            const productWishlistCounts: { [productId: string]: number } = {};

            await Promise.all(allWishlistsSnapshot.docs.map(async (userWishlistDoc) => {
              const itemsCollectionRef = collection(db, "wishlists", userWishlistDoc.id, "items");
              const itemsSnapshot = await getDocs(itemsCollectionRef);
              itemsSnapshot.forEach((itemDoc) => {
                const productId = itemDoc.id;
                productWishlistCounts[productId] = (productWishlistCounts[productId] || 0) + 1;
              });
            }));

            const sortedWishedFor = Object.entries(productWishlistCounts)
              .map(([productId, wishlistCount]) => {
                const productDetails = allProducts.find(p => p.id === productId);
                return productDetails ? { productId, wishlistCount, productDetails } : null;
              })
              .filter((item): item is MostWishedForItem => item !== null)
              .sort((a, b) => b.wishlistCount - a.wishlistCount);
            
            setMostWishedFor(sortedWishedFor);
          } catch (err) {
            console.error("Error fetching most wanted products:", err);
            setMostWishedFor([]);
          } finally {
            setLoading(false);
          }
        };
        fetchAdminData();
      }
      // if products are still loading, we wait for the next re-render.
      // setLoading(true) is already set at the start.
      
    } else if (currentUser) {
      // Customer Logic: Fetch personal wishlist
      const wishlistCollectionRef = collection(db, "wishlists", currentUser.uid, "items");
      unsubscribe = onSnapshot(wishlistCollectionRef, (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WishlistItem));
          setWishlist(items);
          setLoading(false);
      }, (error) => {
          console.error("Error fetching wishlist: ", error);
          setWishlist([]);
          setLoading(false);
      });

    } else {
      // Not logged in
      setWishlist([]);
      setMostWishedFor([]);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser, isAdmin, allProducts, productsLoading]);


  const addToWishlist = useCallback(async (product: Product) => {
    if (!currentUser || isAdmin) return;
    const itemRef = doc(db, "wishlists", currentUser.uid, "items", product.id);
    await setDoc(itemRef, product);
  }, [currentUser, isAdmin]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!currentUser || isAdmin) return;
    const itemRef = doc(db, "wishlists", currentUser.uid, "items", productId);
    await deleteDoc(itemRef);
  }, [currentUser, isAdmin]);

  const value = { wishlist, addToWishlist, removeFromWishlist, mostWishedFor, loading };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
