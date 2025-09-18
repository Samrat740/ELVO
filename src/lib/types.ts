
import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  stock: number;
  category: 'Backpack' | 'Handbags' | 'Accessory';
  audience: 'For Him' | 'For Her';
  featured: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
    id: string;
    userId: string | null;
    shippingInfo: {
        name: string;
        email: string;
        address: string;
        city: string;
        zip: string;
    };
    items: {
        id: string;
        name: string;
        quantity: number;
        price: number;
        imageUrl: string;
    }[];
    total: number;
    createdAt: Timestamp;
}
