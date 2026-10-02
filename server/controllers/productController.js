import Product from "../models/Product.js";

// GET /api/products
// Supports optional ?category= and ?search= query params so the same
// endpoint can serve the plain product list as well as filtered results.
export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, unit, image, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      unit,
      image,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    Object.assign(product, req.body);
    const updated = await product.save();

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories
// Derives the list of categories from the products already in the
// database, so it can never go out of sync with what is actually for sale.
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories.sort());
  } catch (error) {
    next(error);
  }
};
