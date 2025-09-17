export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
}

export interface CartItem extends Product {
  quantity: number;
}
