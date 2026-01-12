import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'db', 'data.json');

const seedData = {
  products: [
    {
      id: 1,
      name: "Headphones AeroMax Pro",
      categoryId: 1,
      price: 199.99,
      description: "Premium wireless headphones with active noise cancellation",
      image: "headphones-aeromax.png",
      stock: 45,
      rating: 4.7,
      reviews: 234
    },
    {
      id: 2,
      name: "Studio Monitor Headphones",
      categoryId: 1,
      price: 349.99,
      description: "Professional-grade headphones for audio production",
      image: "headphones-studio.png",
      stock: 28,
      rating: 4.9,
      reviews: 156
    },
    {
      id: 3,
      name: "MiniPods Earbuds",
      categoryId: 2,
      price: 129.99,
      description: "Compact earbuds with superior sound quality",
      image: "earbuds-minipods.png",
      stock: 67,
      rating: 4.5,
      reviews: 421
    },
    {
      id: 4,
      name: "Silent Series Earbuds",
      categoryId: 2,
      price: 99.99,
      description: "Noise-isolating earbuds for immersive listening",
      image: "earbuds-silent.png",
      stock: 89,
      rating: 4.3,
      reviews: 512
    },
    {
      id: 5,
      name: "SoundBar Deluxe",
      categoryId: 3,
      price: 449.99,
      description: "Home theater quality soundbar with Dolby Atmos",
      image: "speakers-soundbar.png",
      stock: 34,
      rating: 4.8,
      reviews: 289
    },
    {
      id: 6,
      name: "Portable Speaker Max",
      categoryId: 3,
      price: 179.99,
      description: "Waterproof portable Bluetooth speaker",
      image: "speakers-soundwave.png",
      stock: 52,
      rating: 4.6,
      reviews: 378
    },
    {
      id: 7,
      name: "Gaming Headset Pulse",
      categoryId: 4,
      price: 89.99,
      description: "High-performance gaming headset with surround sound",
      image: "gaming-headset-pulse.png",
      stock: 41,
      rating: 4.4,
      reviews: 198
    },
    {
      id: 8,
      name: "Wireless Charging Pad",
      categoryId: 5,
      price: 49.99,
      description: "Fast charging pad for all Qi-compatible devices",
      image: "daniel-romero-6V5vTuoeCZg-unsplash.jpg",
      stock: 123,
      rating: 4.7,
      reviews: 567
    }
  ],
  categories: [
    { id: 1, name: "Headphones", description: "Premium headphones for all occasions" },
    { id: 2, name: "Earbuds", description: "Compact earbuds with great sound" },
    { id: 3, name: "Speakers", description: "Powerful speakers for every space" },
    { id: 4, name: "Gaming", description: "Gaming peripherals and headsets" },
    { id: 5, name: "Accessories", description: "Tech accessories and more" }
  ],
  customers: [
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "+33612345678",
      address: "123 Rue de Paris, 75001 Paris"
    }
  ],
  orders: [
    {
      id: 1,
      customerId: 1,
      items: [
        { productId: 1, quantity: 1, price: 199.99 },
        { productId: 3, quantity: 2, price: 129.99 }
      ],
      subtotal: 459.97,
      tax: 91.99,
      shipping: 15.00,
      total: 566.96,
      status: "COMPLETED",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

function ensureDbDir() {
  const dbDir = path.join(__dirname, '..', '..', 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

function seedDatabase() {
  try {
    ensureDbDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2));
    console.log('✅ Database seeded successfully!');
    console.log(`📦 Products: ${seedData.products.length}`);
    console.log(`📂 Categories: ${seedData.categories.length}`);
    console.log(`👥 Customers: ${seedData.customers.length}`);
    console.log(`📋 Orders: ${seedData.orders.length}`);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
