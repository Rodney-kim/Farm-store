import Order from "../models/Order.js";
import Product from "../models/Product.js";

// POST /api/orders
// Re-checks price and stock against the database rather than trusting
// the numbers sent by the browser. Stock is reduced later, when payment succeeds.
export const createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, email, address, products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      res.status(400);
      throw new Error("Cannot place an order with an empty cart");
    }

    const orderProducts = [];
    let totalAmount = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.name || item.productId}`);
      }

      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      orderProducts.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      customerName,
      phone,
      email,
      address,
      products: orderProducts,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders (admin only)
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
