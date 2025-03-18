import { FoodItem, Category } from '../types';

export const categories: Category[] = [
  {
    id: "indian-main",
    name: "Indian Main Course",
    description: "Traditional Indian curries and gravies",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=450&fit=crop"
  },
  {
    id: "fast-food",
    name: "Fast Food",
    description: "Quick and delicious street food favorites",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=450&fit=crop"
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Refreshing drinks and traditional beverages",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=450&fit=crop"
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet treats and traditional Indian desserts",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=450&fit=crop"
  }
];

export const foodItems: FoodItem[] = [
  // Indian Main Course
  {
    id: 1,
    name: "Butter Chicken",
    price: 85,
    description: "Tender chicken in rich, creamy tomato gravy with butter and spices",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    category: "indian-main",
    isVeg: false,
    spiceLevel: "medium"
  },
  {
    id: 2,
    name: "Paneer Tikka Masala",
    price: 75,
    description: "Grilled cottage cheese cubes in spiced tomato-based curry sauce",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
    category: "indian-main",
    isVeg: true,
    spiceLevel: "medium"
  },

  // Fast Food
  {
    id: 4,
    name: "Vada Pav",
    price: 25,
    description: "Mumbai's favorite street food - spiced potato patty in a bun",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
    category: "fast-food",
    isVeg: true,
    spiceLevel: "hot"
  },
  {
    id: 5,
    name: "Pav Bhaji",
    price: 35,
    description: "Mashed vegetables in spicy gravy served with buttered bread",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
    category: "fast-food",
    isVeg: true,
    spiceLevel: "medium"
  },
  {
    id: 6,
    name: "Samosa",
    price: 15,
    description: "Crispy pastry filled with spiced potatoes and peas",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    category: "fast-food",
    isVeg: true,
    spiceLevel: "mild"
  },

  // Beverages
  {
    id: 7,
    name: "Masala Chai",
    price: 12,
    description: "Indian spiced tea with milk",
    image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&h=300&fit=crop",
    category: "beverages",
    isVeg: true,
    spiceLevel: "mild"
  },
  {
    id: 8,
    name: "Mango Lassi",
    price: 25,
    description: "Sweet yogurt drink blended with mango pulp",
    image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop",
    category: "beverages",
    isVeg: true,
    spiceLevel: "mild"
  },
  {
    id: 9,
    name: "Fresh Lime Soda",
    price: 18,
    description: "Refreshing lime-based drink served sweet or salty",
    image: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&h=300&fit=crop",
    category: "beverages",
    isVeg: true,
    spiceLevel: "mild"
  },

  // Desserts
  {
    id: 12,
    name: "Kheer",
    price: 28,
    description: "Traditional rice pudding with nuts and cardamom",
    image: "https://images.unsplash.com/photo-1633383718081-22ac93e3db65?w=400&h=300&fit=crop",
    category: "desserts",
    isVeg: true,
    spiceLevel: "mild"
  }
];