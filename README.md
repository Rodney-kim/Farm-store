# FarmStore — Farm & Agricultural Products E-Commerce MVP

A simple, clean, full-stack online store for farm produce, built with React
(Vite) on the frontend and Node.js/Express + MongoDB on the backend.

## Features

- Browse products, search by name, filter by category
- Product detail pages with a quantity selector
- Shopping cart with persistence in `localStorage`
- Checkout flow that creates a real order in MongoDB
- Simple REST API for products, categories and orders

Not included in this MVP (by design): user authentication, online payments,
delivery tracking, product reviews, and an admin dashboard.

## Tech Stack

| Layer    | Technology                                   |
| -------- | --------------------------------------------- |
| Frontend | React 18, Vite, React Router, Fetch API        |
| Backend  | Node.js, Express                              |
| Database | MongoDB with Mongoose                          |

## Project Structure

```
farm-ecommerce/
├── client/            React frontend (Vite)
│   └── src/
│       ├── components/  Reusable UI pieces (Navbar, ProductCard, ...)
│       ├── pages/       One file per route (Home, Products, Cart, ...)
│       ├── context/     CartContext for global cart state
│       └── services/    api.js — all fetch calls to the backend
│
└── server/            Express backend
    ├── config/          Database connection
    ├── models/          Mongoose schemas (Product, Order)
    ├── controllers/     Business logic for each route
    ├── routes/          Express route definitions
    ├── middleware/       Error handling
    └── seed.js           Loads sample products into MongoDB
```

## Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - a local MongoDB server (`mongodb://127.0.0.1:27017`), or
  - a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

## 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and set your own values:

```
MONGODB_URI=mongodb://127.0.0.1:27017/farmstore
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Load the sample products (vegetables, fruits, dairy, eggs, cereals, and
other farm produce) into the database:

```bash
npm run seed
```

Start the API server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`. Visit `http://localhost:5000/`
in a browser — you should see `{"message":"FarmStore API is running"}`.

## 2. Frontend Setup

In a **second terminal**:

```bash
cd client
npm install
npm run dev
```

The site will run at `http://localhost:5173`. During development, Vite's
dev server proxies any request to `/api/...` straight to the Express
backend on port 5000 (see `vite.config.js`), so no extra configuration
is needed for the two to talk to each other.

## API Reference

| Method | Endpoint             | Description                          |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/api/products`       | List products (`?category=`, `?search=`) |
| GET    | `/api/products/:id`   | Get a single product                 |
| POST   | `/api/products`       | Create a product                     |
| PUT    | `/api/products/:id`   | Update a product                     |
| DELETE | `/api/products/:id`   | Delete a product                     |
| GET    | `/api/categories`     | List distinct product categories     |
| POST   | `/api/orders`         | Place an order                       |
| GET    | `/api/orders/:id`     | Get a single order                   |

## Testing the API Directly

With the server running, try:

```bash
curl http://localhost:5000/api/products
curl http://localhost:5000/api/categories
```

## Notes on the Sample Data

Product images are stored as emoji placeholders (e.g. `"🍅"` for tomatoes)
so the store works immediately without needing real photo assets. The
`image` field on the Product model is a plain string — swap in real image
URLs whenever you have product photography, no schema changes required.

## Troubleshooting

- **"Could not reach the server"** on the frontend — make sure the backend
  is running on port 5000 and that `MONGODB_URI` in `server/.env` is
  correct.
- **Empty product list** — run `npm run seed` inside `server/` at least
  once.
- **CORS errors in the browser console** — check that `CLIENT_ORIGIN` in
  `server/.env` matches the URL the frontend actually runs on.
