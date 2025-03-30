// In-memory database for products
export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}

// Sample products for the demo
export const products: ProductData[] = [
  {
    id: "1",
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    category: "electronics",
    stock: 50,
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Smartphone X",
    description: "Next-generation smartphone with advanced features",
    price: 799.99,
    category: "electronics",
    stock: 100,
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Automatic coffee maker with built-in grinder",
    price: 149.99,
    category: "home",
    stock: 25,
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: 249.99,
    category: "electronics",
    stock: 75,
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Fitness Tracker",
    description: "Water-resistant fitness tracker with heart rate monitor",
    price: 99.99,
    category: "wearables",
    stock: 60,
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
