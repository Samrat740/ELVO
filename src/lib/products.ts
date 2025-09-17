import { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Accent Chair',
    description: 'A stylish modern chair with a minimalist design, perfect for any contemporary living space. Upholstered in a durable fabric with solid wood legs.',
    price: 299.99,
    imageUrl: PlaceHolderImages.find(p => p.id === '1')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === '1')?.imageHint || 'modern chair',
  },
  {
    id: '2',
    name: 'Wooden Desk Lamp',
    description: 'A sleek, wooden desk lamp that provides warm, ambient light for your workspace. Features an adjustable arm and a minimalist aesthetic.',
    price: 79.99,
    imageUrl: PlaceHolderImages.find(p => p.id === '2')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === '2')?.imageHint || 'desk lamp',
  },
  {
    id: '3',
    name: 'Elegant 3-Seater Sofa',
    description: 'A comfortable and elegant sofa for your living room, upholstered in high-quality linen. Its deep seats and plush cushions offer ultimate relaxation.',
    price: 899.99,
    imageUrl: PlaceHolderImages.find(p => p.id === '3')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === '3')?.imageHint || 'elegant sofa',
  },
  {
    id: '4',
    name: 'Ceramic Mug Set',
    description: 'A set of four ceramic mugs, each with a unique reactive glaze. Dishwasher and microwave safe, perfect for your morning coffee or tea.',
    price: 49.99,
    imageUrl: PlaceHolderImages.find(p => p.id === '4')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === '4')?.imageHint || 'ceramic mugs',
  },
  {
    id: '5',
    name: 'Minimalist Wall Clock',
    description: 'A silent, non-ticking minimalist wall clock with a clean face and wooden hands. Adds a touch of modern simplicity to any room.',
    price: 65.00,
    imageUrl: PlaceHolderImages.find(p => p.id === '5')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === '5')?.imageHint || 'wall clock',
  },
  {
    id: '6',
    name: 'Geometric Area Rug',
    description: 'A plush, soft-touch area rug featuring a modern geometric pattern. Adds texture and style to your bedroom or living area.',
    price: 199.50,
    imageUrl: PlaceHolderImages.find(p => p.id === '6')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === '6')?.imageHint || 'area rug',
  },
  {
    id: '7',
    name: 'Hanging Planter Set',
    description: 'A set of three ceramic hanging planters, ideal for creating a vibrant indoor garden. Comes with adjustable ropes for easy installation.',
    price: 55.99,
    imageUrl: PlaceHolderImages.find(p => p.id === '7')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === '7')?.imageHint || 'hanging planters',
  },
  {
    id: '8',
    name: 'Handcrafted Wooden Bowl',
    description: 'An artisanal decorative bowl handcrafted from solid acacia wood. Perfect as a centerpiece or for holding keys and other small items.',
    price: 45.00,
    imageUrl: PlaceHolderImages.find(p => p.id === '8')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === '8')?.imageHint || 'wooden bowl',
  },
];

export const getInitialProducts = () => initialProducts;
