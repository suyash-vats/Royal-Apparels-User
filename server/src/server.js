import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { clerkMiddleware, createClerkClient, getAuth } from "@clerk/express";
import { randomUUID } from "node:crypto";
import {
  brandStory,
  categories,
  homeCollections,
  products,
  testimonials
} from "./data/seedData.js";

dotenv.config();

const {
  PORT = 5000,
  CLIENT_URL = "http://localhost:5173",
  MONGO_URI,
  MONGO_DB_NAME = "royal",
  MONGO_FORCE_SEEDLIST = "false",
  MONGO_SEEDLIST_HOSTS = "",
  MONGO_REPLICA_SET = "",
  CLERK_SECRET_KEY,
  CLERK_ADMIN_EMAILS = "",
  CLERK_ADMIN_USER_IDS = "",
  STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  AUTO_SEED = "true"
} = process.env;

const isPlaceholderValue = (value = "") =>
  value.includes("replace_me") || value.includes("<username>");

if (!MONGO_URI || isPlaceholderValue(MONGO_URI)) {
  console.error("FATAL: MONGO_URI is required. Add it to server/.env and restart.");
  process.exit(1);
}

if (!CLERK_SECRET_KEY || isPlaceholderValue(CLERK_SECRET_KEY)) {
  console.error("FATAL: CLERK_SECRET_KEY is required. Add it to server/.env and restart.");
  process.exit(1);
}

const localClientOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:4174",
  "http://127.0.0.1:4174"
];
const clientOrigins = [
  ...new Set([
    ...CLIENT_URL.split(",").map((origin) => origin.trim()).filter(Boolean),
    ...localClientOrigins
  ])
];
const adminEmails = CLERK_ADMIN_EMAILS.split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
const adminUserIds = CLERK_ADMIN_USER_IDS.split(",")
  .map((id) => id.trim())
  .filter(Boolean);
const seedOnly = process.argv.includes("--seed-only");
const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });
const normalizeBoolean = (value = "") => value.toLowerCase() === "true";

const buildMongoConnectionUri = () => {
  const source = new URL(MONGO_URI);
  const dbName =
    source.pathname && source.pathname !== "/"
      ? source.pathname.slice(1)
      : MONGO_DB_NAME;

  if (
    normalizeBoolean(MONGO_FORCE_SEEDLIST) &&
    source.protocol === "mongodb+srv:"
  ) {
    const hosts = MONGO_SEEDLIST_HOSTS.split(",")
      .map((host) => host.trim())
      .filter(Boolean);

    if (!hosts.length) {
      throw new Error("MONGO_SEEDLIST_HOSTS is required when MONGO_FORCE_SEEDLIST=true.");
    }

    const params = new URLSearchParams(source.search);
    params.set("ssl", "true");
    params.set("authSource", params.get("authSource") || "admin");
    params.set("retryWrites", params.get("retryWrites") || "true");
    params.set("w", params.get("w") || "majority");
    params.set("appName", params.get("appName") || "Royal");

    if (MONGO_REPLICA_SET) {
      params.set("replicaSet", MONGO_REPLICA_SET);
    }

    const credentials = `${source.username}:${source.password}`;
    return `mongodb://${credentials}@${hosts.join(",")}/${dbName}?${params.toString()}`;
  }

  if (!source.pathname || source.pathname === "/") {
    source.pathname = `/${dbName}`;
  }

  return source.toString();
};

const mongoConnectionUri = buildMongoConnectionUri();

const app = express();

app.use(
  cors({
    origin: clientOrigins,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Clerk middleware — populates req.auth on every request
app.use(clerkMiddleware({ clerkClient: clerk }));

// ─── Mongoose Schemas ────────────────────────────────────────────────────────

const addressSchema = new mongoose.Schema(
  {
    label: String,
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: "India" }
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    stock: { type: Number, default: 0 }
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    image: String,
    accent: String
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: String,
    description: String,
    category: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: Number,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    badges: [String],
    images: [String],
    fabric: String,
    fit: String,
    care: String,
    tags: [String],
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    variants: [variantSchema]
  },
  { timestamps: true }
);

const orderItemSchema = new mongoose.Schema(
  {
    productId: String,
    slug: String,
    title: String,
    image: String,
    sku: String,
    color: String,
    size: String,
    quantity: Number,
    price: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    clerkId: { type: String, index: true, default: null },
    customer: {
      name: String,
      email: String,
      phone: String
    },
    items: [orderItemSchema],
    pricing: {
      subtotal: Number,
      shipping: Number,
      tax: Number,
      discount: Number,
      total: Number
    },
    shippingAddress: addressSchema,
    payment: {
      provider: String,
      status: String,
      reference: String,
      publishableKey: String,
      sessionId: String,
      demo: Boolean
    },
    status: { type: String, default: "pending" },
    deliveryNote: String
  },
  { timestamps: true }
);

// Customer identity comes from Clerk; MongoDB stores ecommerce profile data.
const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "customer" },
    phone: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    addresses: [addressSchema]
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

// ─── Payment clients ─────────────────────────────────────────────────────────

const stripeClient = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;
const razorpayClient =
  RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
    ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
    : null;

// ─── Utilities ────────────────────────────────────────────────────────────────

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const formatProduct = (input) => {
  const product = input.toObject ? input.toObject() : input;
  const id = product._id?.toString() || product.id;
  const variants = product.variants || [];

  return {
    ...product,
    id,
    availableColors: unique(variants.map((v) => v.color)),
    sizes: unique(variants.map((v) => v.size)),
    inventoryCount: variants.reduce(
      (total, v) => total + normalizeNumber(v.stock),
      0
    )
  };
};

const formatUser = (input) => {
  const user = input.toObject ? input.toObject() : input;
  return {
    id: user._id?.toString() || user.id,
    clerkId: user.clerkId,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    avatarUrl: user.avatarUrl || "",
    addresses: user.addresses || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const formatOrder = (input) => {
  const order = input.toObject ? input.toObject() : input;
  return {
    ...order,
    id: order._id?.toString() || order.id
  };
};

const generateOrderNumber = () =>
  `VEL-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

// Clerk auth middleware
const getPrimaryEmail = (clerkUser) => {
  const primaryEmail = clerkUser.emailAddresses?.find(
    (email) => email.id === clerkUser.primaryEmailAddressId
  );
  const email =
    primaryEmail?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;

  return (email || `${clerkUser.id}@noemail.royal-apparels.local`).toLowerCase();
};

const getClerkDisplayName = (clerkUser, email) =>
  [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
  clerkUser.username ||
  email.split("@")[0] ||
  "Royal Apparels Customer";

const metadataHasAdminRole = (metadata = {}) =>
  Boolean(metadata && (metadata.role === "admin" || metadata.admin === true));

const resolveUserRole = ({ clerkId, email, existingRole, clerkUser }) => {
  if (
    existingRole === "admin" ||
    adminUserIds.includes(clerkId) ||
    adminEmails.includes(email)
  ) {
    return "admin";
  }

  if (
    metadataHasAdminRole(clerkUser.publicMetadata) ||
    metadataHasAdminRole(clerkUser.privateMetadata)
  ) {
    return "admin";
  }

  return "customer";
};

const syncClerkUser = async (req) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return null;
  }

  const clerkUser = await clerk.users.getUser(auth.userId);
  const email = getPrimaryEmail(clerkUser);
  const existing = await User.findOne({
    $or: [{ clerkId: clerkUser.id }, { email }]
  });
  const role = resolveUserRole({
    clerkId: clerkUser.id,
    email,
    existingRole: existing?.role,
    clerkUser
  });

  const user = await User.findOneAndUpdate(
    existing ? { _id: existing._id } : { clerkId: clerkUser.id },
    {
      $set: {
        clerkId: clerkUser.id,
        name: getClerkDisplayName(clerkUser, email),
        email,
        role,
        avatarUrl: clerkUser.imageUrl || ""
      },
      $setOnInsert: {
        phone: "",
        addresses: []
      }
    },
    {
      upsert: true,
      new: true,
      runValidators: false,
      setDefaultsOnInsert: true
    }
  );

  return formatUser(user);
};

const protect = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }

    const user = await syncClerkUser(req);
    if (!user) {
      res.status(401).json({ message: "Unable to resolve user." });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Clerk authentication failed:", error.message);
    res.status(401).json({ message: "Invalid or expired Clerk session." });
  }
};

const optionalAuth = async (req, _res, next) => {
  try {
    const auth = getAuth(req);
    if (auth?.userId) {
      req.user = await syncClerkUser(req);
    }
  } catch (error) {
    console.warn("Optional Clerk sync skipped:", error.message);
  }

  next();
};

const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
    return;
  }

  res.status(403).json({ message: "Admin access required." });
};

// ─── Data Access ─────────────────────────────────────────────────────────────

const getCategories = async () =>
  (await Category.find().sort({ createdAt: 1 })).map((item) => item.toObject());

const getProducts = async (filters = {}) => {
  const query = {};

  if (filters.category) query.category = filters.category;
  if (filters.featured === "true") query.featured = true;
  if (filters.newArrival === "true") query.newArrival = true;

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { subtitle: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
      { tags: { $regex: filters.search, $options: "i" } }
    ];
  }

  let sort = { createdAt: -1 };
  if (filters.sort === "price-low") sort = { price: 1 };
  else if (filters.sort === "price-high") sort = { price: -1 };
  else if (filters.sort === "rating") sort = { rating: -1 };

  return (await Product.find(query).sort(sort)).map(formatProduct);
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug });
  return product ? formatProduct(product) : null;
};

const getCatalogBySlugs = async (slugs) =>
  (await Product.find({ slug: { $in: slugs } })).map(formatProduct);

const getOrdersForUser = async (clerkId, email) => {
  const orders = await Order.find({
    $or: [{ clerkId }, { "customer.email": email }]
  }).sort({ createdAt: -1 });
  return orders.map(formatOrder);
};

const calculatePricing = (items) => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 5000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.05);
  const discount = subtotal >= 8500 ? 400 : 0;
  const total = subtotal + shipping + tax - discount;
  return { subtotal, shipping, tax, discount, total };
};

const normalizeProductPayload = (payload = {}) => {
  const title = payload.title?.trim();
  const slug = slugify(payload.slug || payload.title || "");
  const imageList = unique(
    (payload.images || []).map((img) => String(img).trim()).filter(Boolean)
  );
  const variants = (payload.variants || [])
    .map((v) => ({
      sku: String(v.sku || `${slug}-${v.color}-${v.size}`).trim().toUpperCase(),
      color: String(v.color || "").trim(),
      size: String(v.size || "").trim(),
      stock: normalizeNumber(v.stock)
    }))
    .filter((v) => v.color && v.size);

  return {
    title,
    slug,
    subtitle: payload.subtitle?.trim() || "",
    description: payload.description?.trim() || "",
    category: payload.category?.trim() || "new-in",
    price: normalizeNumber(payload.price),
    compareAtPrice: normalizeNumber(payload.compareAtPrice),
    rating: normalizeNumber(payload.rating, 4.7),
    reviewCount: normalizeNumber(payload.reviewCount, 0),
    badges: unique((payload.badges || []).map((b) => String(b).trim())),
    images: imageList,
    fabric: payload.fabric?.trim() || "",
    fit: payload.fit?.trim() || "",
    care: payload.care?.trim() || "",
    tags: unique(
      (payload.tags || []).map((t) => String(t).trim().toLowerCase())
    ),
    featured: Boolean(payload.featured),
    newArrival: Boolean(payload.newArrival),
    variants:
      variants.length > 0
        ? variants
        : [
            {
              sku: `${slug}-DEFAULT`,
              color: "Default",
              size: "One Size",
              stock: 10
            }
          ]
  };
};

const createPaymentSession = async ({
  provider,
  amount,
  currency = "INR",
  metadata = {}
}) => {
  const reference = `${provider}_${randomUUID().slice(0, 12)}`;
  const amountInSmallest = Math.round(amount * 100);

  if (provider === "stripe") {
    if (stripeClient) {
      const intent = await stripeClient.paymentIntents.create({
        amount: amountInSmallest,
        currency: currency.toLowerCase(),
        metadata
      });
      return {
        provider,
        demo: false,
        reference: intent.id,
        sessionId: intent.id,
        clientSecret: intent.client_secret,
        publishableKey: STRIPE_PUBLISHABLE_KEY || ""
      };
    }
    return {
      provider,
      demo: true,
      reference,
      sessionId: reference,
      clientSecret: `pi_demo_${randomUUID().replaceAll("-", "")}`,
      publishableKey: STRIPE_PUBLISHABLE_KEY || "pk_test_demo"
    };
  }

  if (provider === "razorpay") {
    if (razorpayClient) {
      const order = await razorpayClient.orders.create({
        amount: amountInSmallest,
        currency,
        receipt: reference,
        notes: metadata
      });
      return {
        provider,
        demo: false,
        reference: order.receipt,
        sessionId: order.id,
        publishableKey: RAZORPAY_KEY_ID || ""
      };
    }
    return {
      provider,
      demo: true,
      reference,
      sessionId: `order_${randomUUID().replaceAll("-", "").slice(0, 14)}`,
      publishableKey: RAZORPAY_KEY_ID || "rzp_test_demo"
    };
  }

  return { provider: "cod", demo: true, reference, sessionId: reference };
};

const saveProduct = async (targetSlug, payload) => {
  const saved = await Product.findOneAndUpdate(
    { slug: targetSlug || payload.slug },
    payload,
    { new: true, upsert: true }
  );
  return formatProduct(saved);
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  return order ? formatOrder(order) : null;
};

const buildHomePayload = (catalog, categoryItems) => ({
  brandStory,
  categories: categoryItems,
  collections: homeCollections,
  testimonials,
  featuredProducts: catalog.filter((p) => p.featured).slice(0, 4),
  newArrivals: catalog.filter((p) => p.newArrival).slice(0, 4)
});

const getAdminOverview = async () => {
  const catalog = await getProducts({ sort: "newest" });
  const orders = (await Order.find().sort({ createdAt: -1 })).map(formatOrder);
  const users = (await User.find({ role: "customer" })).map(formatUser);
  const paidOrders = orders.filter((o) => o.payment?.status === "paid");
  const revenue = paidOrders.reduce(
    (total, o) => total + normalizeNumber(o.pricing?.total),
    0
  );

  return {
    stats: [
      { label: "Revenue", value: `Rs ${revenue.toLocaleString("en-IN")}` },
      { label: "Orders", value: String(orders.length) },
      { label: "Customers", value: String(users.length) },
      {
        label: "Avg order",
        value: `Rs ${Math.round(
          revenue / (paidOrders.length || 1)
        ).toLocaleString("en-IN")}`
      }
    ],
    recentOrders: orders.slice(0, 5),
    lowStockProducts: catalog
      .filter((p) => p.variants.some((v) => normalizeNumber(v.stock) <= 5))
      .slice(0, 6),
    products: catalog
  };
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

const seedMongoData = async () => {
  const [categoryCount, productCount] = await Promise.all([
    Category.countDocuments(),
    Product.countDocuments()
  ]);

  if (!categoryCount) {
    await Category.insertMany(categories);
    console.log("Seeded categories.");
  }

  if (!productCount) {
    await Product.insertMany(products);
    console.log("Seeded products.");
  }
};

// ─── DB Connect ───────────────────────────────────────────────────────────────

const connectMongo = async () => {
  try {
    await mongoose.connect(mongoConnectionUri, { serverSelectionTimeoutMS: 15000 });
    console.log(`MongoDB Atlas connected. Database: ${mongoose.connection.name}`);

    if (AUTO_SEED !== "false") {
      await seedMongoData();
      console.log("Seed check complete.");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    if (error.message.includes("querySrv")) {
      console.error(
        "Node could not resolve the Atlas SRV record. Set MONGO_FORCE_SEEDLIST=true with the Atlas shard hosts, or fix Node DNS on this machine."
      );
    }
    if (error.message.toLowerCase().includes("whitelist")) {
      console.error(
        "Atlas is reachable, but this machine is not allowed in MongoDB Atlas Network Access. Add your current IP address in Atlas, then rerun the server."
      );
    }
    process.exit(1);
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    mode: "mongo",
    auth: "clerk",
    timestamp: new Date().toISOString()
  });
});

// Public store data
app.get("/api/store/home", async (_req, res) => {
  const [catalog, categoryItems] = await Promise.all([
    getProducts({ sort: "newest" }),
    getCategories()
  ]);
  res.json(buildHomePayload(catalog, categoryItems));
});

app.get("/api/products", async (req, res) => {
  const items = await getProducts(req.query);
  res.json({ items, total: items.length });
});

app.get("/api/products/:slug", async (req, res) => {
  const product = await getProductBySlug(req.params.slug);
  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }
  res.json(product);
});

// ─── Auth routes (Clerk owns sign-in/sign-up) ─────────────────────────────

/**
 * GET /api/auth/me
 * Returns the synced user doc + their orders.
 * Requires a valid Clerk session token in Authorization: Bearer <token>
 */
app.get("/api/auth/me", protect, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unable to resolve user." });
      return;
    }

    const orders = await getOrdersForUser(user.clerkId, user.email);
    res.json({ user, orders });
  } catch (error) {
    console.error("/api/auth/me error:", error.message);
    res.status(500).json({ message: "Failed to load user." });
  }
});

/**
 * PUT /api/auth/me
 * Updates phone + addresses on the User doc.
 */
app.put("/api/auth/me", protect, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unable to resolve user." });
      return;
    }

    const updated = await User.findOneAndUpdate(
      { clerkId: user.clerkId },
      {
        $set: {
          phone: req.body.phone ?? user.phone,
          addresses: req.body.addresses ?? user.addresses
        }
      },
      { new: true }
    );

    res.json({ user: formatUser(updated) });
  } catch (error) {
    console.error("/api/auth/me PUT error:", error.message);
    res.status(500).json({ message: "Failed to update profile." });
  }
});

// ─── Payments ─────────────────────────────────────────────────────────────────

app.post("/api/payments/session", async (req, res) => {
  const { provider = "cod", amount, currency = "INR", metadata = {} } = req.body;

  if (!amount || amount <= 0) {
    res.status(400).json({ message: "A valid order amount is required." });
    return;
  }

  try {
    const session = await createPaymentSession({ provider, amount, currency, metadata });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── Orders ───────────────────────────────────────────────────────────────────

app.post("/api/orders", optionalAuth, async (req, res) => {
  const {
    customer,
    items,
    shippingAddress,
    paymentMethod = "cod",
    paymentSession,
    deliveryNote = ""
  } = req.body;

  if (!customer?.name || !customer?.email || !shippingAddress?.line1 || !shippingAddress?.city) {
    res.status(400).json({
      message: "Customer and shipping details are required to place the order."
    });
    return;
  }

  if (!Array.isArray(items) || !items.length) {
    res.status(400).json({ message: "Your bag is empty." });
    return;
  }

  try {
    const catalog = await getCatalogBySlugs(items.map((i) => i.slug));
    const catalogMap = new Map(catalog.map((p) => [p.slug, p]));

    const normalizedItems = items
      .map((item) => {
        const product = catalogMap.get(item.slug);
        if (!product) return null;

        const variant =
          product.variants.find(
            (v) => v.color === item.color && v.size === item.size
          ) || product.variants[0];

        return {
          productId: product.id,
          slug: product.slug,
          title: product.title,
          image: product.images[0],
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          quantity: Math.max(1, normalizeNumber(item.quantity, 1)),
          price: product.price
        };
      })
      .filter(Boolean);

    if (!normalizedItems.length) {
      res.status(400).json({ message: "We could not validate the selected items." });
      return;
    }

    const pricing = calculatePricing(normalizedItems);
    const isCOD = paymentMethod === "cod";

    const clerkId = req.user?.clerkId || null;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      clerkId,
      customer: {
        name: customer.name,
        email: customer.email.toLowerCase(),
        phone: customer.phone || ""
      },
      items: normalizedItems,
      pricing,
      shippingAddress,
      payment: {
        provider: paymentMethod,
        status: isCOD ? "pending" : "paid",
        reference: paymentSession?.reference || `manual_${randomUUID().slice(0, 10)}`,
        publishableKey: paymentSession?.publishableKey || "",
        sessionId: paymentSession?.sessionId || "",
        demo: paymentSession?.demo ?? true
      },
      status: isCOD ? "pending" : "confirmed",
      deliveryNote
    });

    res.status(201).json({
      message: "Order placed successfully.",
      order: formatOrder(order)
    });
  } catch (error) {
    console.error("/api/orders error:", error.message);
    res.status(500).json({ message: "Failed to place order." });
  }
});

app.get("/api/orders/my-orders", protect, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unable to resolve user." });
      return;
    }
    const orders = await getOrdersForUser(user.clerkId, user.email);
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to load orders." });
  }
});

// ─── Admin ─────────────────────────────────────────────────────────────────────

app.get("/api/admin/overview", protect, adminOnly, async (_req, res) => {
  try {
    const overview = await getAdminOverview();
    res.json(overview);
  } catch (error) {
    res.status(500).json({ message: "Failed to load admin overview." });
  }
});

app.post("/api/admin/products", protect, adminOnly, async (req, res) => {
  const payload = normalizeProductPayload(req.body);

  if (!payload.title || !payload.slug || !payload.price) {
    res.status(400).json({ message: "Title, slug, and price are required." });
    return;
  }

  try {
    const product = await saveProduct(payload.slug, payload);
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/admin/products/:slug", protect, adminOnly, async (req, res) => {
  const payload = normalizeProductPayload(req.body);

  if (!payload.title || !payload.slug || !payload.price) {
    res.status(400).json({ message: "Title, slug, and price are required." });
    return;
  }

  try {
    const product = await saveProduct(req.params.slug, payload);
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/api/admin/orders/:id/status", protect, adminOnly, async (req, res) => {
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ message: "A status value is required." });
    return;
  }

  try {
    const order = await updateOrderStatus(req.params.id, status);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── 404 ───────────────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ─── Start ─────────────────────────────────────────────────────────────────────

const start = async () => {
  await connectMongo();

  if (seedOnly) {
    console.log("Seed routine complete.");
    process.exit(0);
  }

  app.listen(PORT, () => {
    console.log(`Veloura API  →  http://localhost:${PORT}`);
    console.log(`Auth         →  Clerk`);
    console.log(`Database     →  MongoDB Atlas`);
  });
};

start();
