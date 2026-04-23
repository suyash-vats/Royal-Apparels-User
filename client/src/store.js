import {
  createElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { api } from "./api";

const StoreContext = createContext(null);

const CART_KEY = "veloura_cart";
const WISHLIST_KEY = "veloura_wishlist";

const fallbackAuth = {
  configured: false,
  isLoaded: true,
  isSignedIn: false,
  getToken: async () => null,
  signOut: async () => {}
};

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_error) {
    // Storage can be blocked in private modes; the app still works in memory.
  }
};

const calculateCartTotals = (cart) => {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 199;
  const tax = Math.round(subtotal * 0.05);
  const discount = subtotal >= 8500 ? 400 : 0;
  const total = subtotal + shipping + tax - discount;
  return { subtotal, shipping, tax, discount, total };
};

export const StoreProvider = ({ children, auth = fallbackAuth }) => {
  const authConfigured = Boolean(auth.configured);
  const authLoaded = auth.isLoaded ?? true;
  const isSignedIn = Boolean(auth.isSignedIn);
  const getToken = auth.getToken || fallbackAuth.getToken;
  const signOut = auth.signOut || fallbackAuth.signOut;

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [products, setProducts] = useState([]);
  const [catalogMeta, setCatalogMeta] = useState({ total: 0 });
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []));
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_KEY, []));
  const [ui, setUi] = useState({
    isCartOpen: false,
    loading: false,
    toast: null
  });
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    writeStorage(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    writeStorage(WISHLIST_KEY, wishlist);
  }, [wishlist]);

  const clearSession = useCallback(() => {
    setUser(null);
    setOrders([]);
    setDashboard(null);
  }, []);

  const showToast = useCallback((message, tone = "neutral") => {
    setUi((current) => ({ ...current, toast: { message, tone } }));
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      setUi((current) => ({ ...current, toast: null }));
    }, 2800);
  }, []);

  const setLoading = useCallback((loading) => {
    setUi((current) => ({ ...current, loading }));
  }, []);

  const getSessionToken = useCallback(async () => {
    if (!authConfigured || !authLoaded || !isSignedIn) {
      return "";
    }

    return (await getToken()) || "";
  }, [authConfigured, authLoaded, getToken, isSignedIn]);

  const hydrateSession = useCallback(async () => {
    const token = await getSessionToken();

    if (!token) {
      clearSession();
      return null;
    }

    const data = await api.me(token);
    setUser(data.user);
    setOrders(data.orders || []);

    if (data.user?.role === "admin") {
      const overview = await api.adminOverview(token);
      setDashboard(overview);
    } else {
      setDashboard(null);
    }

    return data.user;
  }, [clearSession, getSessionToken]);

  const loadSession = useCallback(async () => {
    if (!authLoaded) {
      return;
    }

    if (!authConfigured || !isSignedIn) {
      clearSession();
      return;
    }

    setLoading(true);
    try {
      await hydrateSession();
    } catch (error) {
      clearSession();
      console.error("Session hydration failed:", error.message);
    } finally {
      setLoading(false);
    }
  }, [
    authConfigured,
    authLoaded,
    clearSession,
    hydrateSession,
    isSignedIn,
    setLoading
  ]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const loadHome = useCallback(async () => {
    try {
      const data = await api.home();
      setHomeData(data);
    } catch (error) {
      showToast(error.message, "error");
    }
  }, [showToast]);

  const loadCatalog = useCallback(
    async (filters = {}) => {
      setLoading(true);
      try {
        const data = await api.products(filters);
        setProducts(data.items);
        setCatalogMeta({ total: data.total, filters });
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [setLoading, showToast]
  );

  const loadProduct = useCallback(async (slug) => api.product(slug), []);

  useEffect(() => {
    loadHome();
    loadCatalog();
  }, [loadHome, loadCatalog]);

  const logout = useCallback(async () => {
    if (authConfigured) {
      await signOut();
    }

    clearSession();
    showToast("You have been signed out.", "neutral");
  }, [authConfigured, clearSession, showToast, signOut]);

  const updateProfile = useCallback(
    async (payload) => {
      const token = await getSessionToken();
      if (!token) {
        throw new Error("Please sign in to update your profile.");
      }

      setLoading(true);
      try {
        const data = await api.updateProfile(token, payload);
        setUser(data.user);
        showToast("Profile updated.", "success");
      } finally {
        setLoading(false);
      }
    },
    [getSessionToken, setLoading, showToast]
  );

  const loadDashboard = useCallback(async () => {
    if (user?.role !== "admin") {
      return null;
    }

    const token = await getSessionToken();
    if (!token) {
      return null;
    }

    setLoading(true);
    try {
      const data = await api.adminOverview(token);
      setDashboard(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, [getSessionToken, setLoading, user]);

  const addToCart = useCallback(
    ({ product, color, size, quantity = 1 }) => {
      setCart((current) => {
        const existingIndex = current.findIndex(
          (item) =>
            item.slug === product.slug &&
            item.color === color &&
            item.size === size
        );

        if (existingIndex >= 0) {
          const nextCart = [...current];
          nextCart[existingIndex] = {
            ...nextCart[existingIndex],
            quantity: nextCart[existingIndex].quantity + quantity
          };
          return nextCart;
        }

        return [
          ...current,
          {
            id: `${product.slug}-${color}-${size}`,
            slug: product.slug,
            title: product.title,
            image: product.images[0],
            price: product.price,
            quantity,
            color,
            size
          }
        ];
      });

      setUi((current) => ({ ...current, isCartOpen: true }));
      showToast("Added to bag.", "success");
    },
    [showToast]
  );

  const updateCartItem = useCallback((itemId, quantity) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
        .filter(Boolean)
    );
  }, []);

  const removeCartItem = useCallback(
    (itemId) => {
      setCart((current) => current.filter((item) => item.id !== itemId));
      showToast("Removed from bag.", "neutral");
    },
    [showToast]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (slug) => {
      setWishlist((current) => {
        const exists = current.includes(slug);
        const next = exists
          ? current.filter((item) => item !== slug)
          : [...current, slug];
        showToast(
          exists ? "Removed from saved pieces." : "Saved for later.",
          exists ? "neutral" : "success"
        );
        return next;
      });
    },
    [showToast]
  );

  const createOrder = useCallback(
    async ({ customer, shippingAddress, paymentMethod, deliveryNote }) => {
      if (!cart.length) {
        throw new Error("Your bag is empty.");
      }

      const totals = calculateCartTotals(cart);
      const token = await getSessionToken();
      setLoading(true);

      try {
        const paymentSession = await api.paymentSession({
          provider: paymentMethod,
          amount: totals.total,
          currency: "INR",
          metadata: {
            customer: customer.email,
            items: String(cart.length)
          }
        });

        const data = await api.createOrder(
          {
            customer,
            shippingAddress,
            items: cart,
            paymentMethod,
            paymentSession,
            deliveryNote
          },
          token
        );

        setLastOrder(data.order);
        clearCart();

        if (token) {
          await hydrateSession();
        }

        showToast("Order placed successfully.", "success");
        return data.order;
      } finally {
        setLoading(false);
      }
    },
    [
      cart,
      clearCart,
      getSessionToken,
      hydrateSession,
      setLoading,
      showToast
    ]
  );

  const saveProduct = useCallback(
    async (payload, targetSlug) => {
      const token = await getSessionToken();
      if (!token) {
        throw new Error("Please sign in as admin.");
      }

      setLoading(true);
      try {
        const result = targetSlug
          ? await api.updateProduct(token, targetSlug, payload)
          : await api.createProduct(token, payload);

        showToast("Product saved.", "success");
        await Promise.all([loadCatalog(catalogMeta.filters), loadDashboard()]);
        return result.product;
      } finally {
        setLoading(false);
      }
    },
    [
      catalogMeta.filters,
      getSessionToken,
      loadCatalog,
      loadDashboard,
      setLoading,
      showToast
    ]
  );

  const setOrderStatus = useCallback(
    async (orderId, status) => {
      const token = await getSessionToken();
      if (!token) {
        throw new Error("Please sign in as admin.");
      }

      setLoading(true);
      try {
        await api.updateOrderStatus(token, orderId, status);
        showToast("Order status updated.", "success");
        await loadDashboard();
      } finally {
        setLoading(false);
      }
    },
    [getSessionToken, loadDashboard, setLoading, showToast]
  );

  const cartTotals = useMemo(() => calculateCartTotals(cart), [cart]);
  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      user,
      orders,
      authConfigured,
      authLoaded,
      isAuthLoaded: authLoaded,
      isSignedIn,
      dashboard,
      homeData,
      products,
      catalogMeta,
      cart,
      cartCount,
      cartTotals,
      wishlist,
      ui,
      lastOrder,
      setUi,
      loadHome,
      loadCatalog,
      loadProduct,
      logout,
      updateProfile,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      toggleWishlist,
      createOrder,
      loadDashboard,
      saveProduct,
      setOrderStatus
    }),
    [
      user,
      orders,
      authConfigured,
      authLoaded,
      isSignedIn,
      dashboard,
      homeData,
      products,
      catalogMeta,
      cart,
      cartCount,
      cartTotals,
      wishlist,
      ui,
      lastOrder,
      loadHome,
      loadCatalog,
      loadProduct,
      logout,
      updateProfile,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      toggleWishlist,
      createOrder,
      loadDashboard,
      saveProduct,
      setOrderStatus
    ]
  );

  return createElement(StoreContext.Provider, { value }, children);
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return context;
};
