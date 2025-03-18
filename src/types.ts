import { FoodItem, Category } from '../types';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface FoodItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isVeg: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'out-for-delivery' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: OrderStatus;
  estimatedDelivery: string;
  rating?: number;
  deliveryCharge?: number;
  deliveryAddress: string;
}

export type FilterType = 'all' | 'veg' | 'non-veg';
export type SpiceLevel = 'all' | 'mild' | 'medium' | 'hot';
export type SortOption = 'recommended' | 'price-low' | 'price-high';

export interface Filters {
  type: FilterType;
  spiceLevel: SpiceLevel;
  sort: SortOption;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}