
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/lib/types';
import { getInitialProducts } from '@/lib/products';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from "firebase/firestore";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  getProductById: (productId: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const productsCollection = collection(db, "products");

    const initializeAndSubscribe = async () => {
      // First, check if the collection is empty to decide whether to seed.
      const initialSnapshot = await getDocs(productsCollection);
      if (initialSnapshot.empty) {
        console.log("No products found, seeding database...");
        const initialProducts = getInitialProducts();
        const batch = writeBatch(db);
        initialProducts.forEach((product) => {
          const docRef = doc(db, "products", product.id);
          batch.set(docRef, product);
        });
        await batch.commit();
      }

      // After potentially seeding, set up the real-time listener.
      // This will not re-seed the data when you delete all items.
      const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
      });

      return unsubscribe;
    };
    
    const unsubscribePromise = initializeAndSubscribe();

    return () => {
        unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, []);

  const addProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    const newDocRef = doc(collection(db, "products"));
    const newProduct: Product = { ...productData, id: newDocRef.id };
    await setDoc(newDocRef, newProduct);
  }, []);

  const updateProduct = useCallback(async (updatedProduct: Product) => {
    const productRef = doc(db, "products", updatedProduct.id);
    await setDoc(productRef, updatedProduct, { merge: true });
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
  }, []);

  const getProductById = useCallback((productId: string) => {
    return products.find(p => p.id === productId);
  }, [products]);
  
  const value = { products, addProduct, updateProduct, deleteProduct, getProductById };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
