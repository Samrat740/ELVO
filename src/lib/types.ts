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
