
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/lib/types';
import { getInitialProducts } from '@/lib/products';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from "firebase/firestore";

export type ProductFormData = Omit<Product, 'id'> & { imageFile?: FileList };


interface ProductsContextType {
  products: Product[];
  addProduct: (productData: ProductFormData) => Promise<void>;
  updateProduct: (productId: string, productData: ProductFormData) => Promise<void>;
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

  const uploadImage = async (file: File): Promise<string> => {
    // IMPORTANT: Replace with your Cloudinary cloud name and upload preset.
    const CLOUDINARY_CLOUD_NAME = "dq2julnka";
    const CLOUDINARY_UPLOAD_PRESET = "ecommerce_upload";
    
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const addProduct = useCallback(async (productData: ProductFormData) => {
    let imageUrl = productData.imageUrl || '';
    if (productData.imageFile && productData.imageFile.length > 0) {
      imageUrl = await uploadImage(productData.imageFile[0]);
    }
    
    if (!imageUrl) {
        throw new Error("Product image is required.");
    }

    const { imageFile, ...restData } = productData;

    const newDocRef = doc(collection(db, "products"));
    const newProduct: Omit<Product, 'id'> = { 
        ...restData,
        imageHint: restData.name.toLowerCase().split(' ').slice(0,2).join(' '),
        imageUrl,
    };
     if (!newProduct.hasDiscount) {
        delete newProduct.originalPrice;
        delete newProduct.discountPercentage;
    }
    await setDoc(newDocRef, newProduct);
  }, []);

  const updateProduct = useCallback(async (productId: string, productData: ProductFormData) => {
    let imageUrl = productData.imageUrl || '';
    // Find the original product to get the existing imageUrl
    const originalProduct = products.find(p => p.id === productId);

    if (productData.imageFile && productData.imageFile.length > 0) {
      // If there's a new file, upload it
      imageUrl = await uploadImage(productData.imageFile[0]);
    } else if (originalProduct) {
      // Otherwise, keep the old imageUrl
      imageUrl = originalProduct.imageUrl;
    }
    
    const { imageFile, ...restData } = productData;
    
    const productRef = doc(db, "products", productId);
    const productToUpdate = {
        ...restData,
        imageHint: restData.name.toLowerCase().split(' ').slice(0,2).join(' '),
        imageUrl 
    };

    if (!productToUpdate.hasDiscount) {
        delete productToUpdate.originalPrice;
        delete productToUpdate.discountPercentage;
    }

    await setDoc(productRef, productToUpdate, { merge: true });
  }, [products]);

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
