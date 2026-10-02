// Populates the database with sample products so the site has
// something to display right after setup. Run with: npm run seed
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const sampleProducts = [
  {
    name: "Fresh Tomatoes",
    description: "Vine-ripened tomatoes, hand-picked and perfect for stews and salads.",
    price: 150,
    category: "Vegetables",
    unit: "kg",
    image: "🍅",
    stock: 80,
  },
  {
    name: "Sukuma Wiki",
    description: "Fresh collard greens, harvested daily from local farms.",
    price: 50,
    category: "Vegetables",
    unit: "bunch",
    image: "🥬",
    stock: 120,
  },
  {
    name: "Irish Potatoes",
    description: "Clean, farm-fresh potatoes ideal for roasting, mashing or fries.",
    price: 120,
    category: "Vegetables",
    unit: "kg",
    image: "🥔",
    stock: 100,
  },
  {
    name: "Red Onions",
    description: "Firm, aromatic red onions from the highlands.",
    price: 130,
    category: "Vegetables",
    unit: "kg",
    image: "🧅",
    stock: 90,
  },
  {
    name: "Ripe Bananas",
    description: "Sweet, naturally ripened bananas grown without artificial chemicals.",
    price: 100,
    category: "Fruits",
    unit: "bunch",
    image: "🍌",
    stock: 60,
  },
  {
    name: "Mangoes",
    description: "Juicy, in-season mangoes bursting with flavour.",
    price: 180,
    category: "Fruits",
    unit: "kg",
    image: "🥭",
    stock: 45,
  },
  {
    name: "Avocados",
    description: "Creamy Hass avocados, great for guacamole or on toast.",
    price: 200,
    category: "Fruits",
    unit: "kg",
    image: "🥑",
    stock: 70,
  },
  {
    name: "Fresh Cow Milk",
    description: "Whole, unprocessed cow milk delivered fresh each morning.",
    price: 60,
    category: "Dairy",
    unit: "litre",
    image: "🥛",
    stock: 150,
  },
  {
    name: "Natural Yoghurt",
    description: "Creamy plain yoghurt made from fresh farm milk.",
    price: 90,
    category: "Dairy",
    unit: "500ml",
    image: "🍦",
    stock: 55,
  },
  {
    name: "Free-Range Eggs",
    description: "Eggs from free-range hens, rich in flavour and nutrients.",
    price: 15,
    category: "Eggs",
    unit: "piece",
    image: "🥚",
    stock: 300,
  },
  {
    name: "Maize Grain",
    description: "Dried, cleaned maize grain ready for milling or storage.",
    price: 70,
    category: "Cereals",
    unit: "kg",
    image: "🌽",
    stock: 200,
  },
  {
    name: "Brown Rice",
    description: "Wholesome, locally grown brown rice.",
    price: 160,
    category: "Cereals",
    unit: "kg",
    image: "🍚",
    stock: 85,
  },
  {
    name: "Pure Honey",
    description: "Raw, unprocessed honey harvested from farm apiaries.",
    price: 500,
    category: "Other Farm Products",
    unit: "500ml jar",
    image: "🍯",
    stock: 40,
  },
  {
    name: "Layers Mash (Animal Feed)",
    description: "Balanced feed formulated for laying hens.",
    price: 1800,
    category: "Other Farm Products",
    unit: "70kg bag",
    image: "🌾",
    stock: 25,
  },
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} sample products.`);
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

importData();
