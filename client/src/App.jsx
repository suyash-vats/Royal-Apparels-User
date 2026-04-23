import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useStore } from "./store";
import { INTRO_STORAGE_KEY } from "./utils";

// Layout components
import AnnouncementBar from "./components/AnnouncementBar";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import CartDrawer from "./components/CartDrawer";
import MobileDock from "./components/MobileDock";
import Toast from "./components/Toast";
import IntroLoader from "./components/IntroLoader";

// Pages
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import SavedPage from "./pages/SavedPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const { ui } = useStore();
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Show intro loader only once per session
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const introSeen = window.sessionStorage.getItem(INTRO_STORAGE_KEY);
    if (introSeen) {
      return undefined;
    }
    setShowIntro(true);
    const timer = window.setTimeout(() => {
      setShowIntro(false);
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
    }, 2100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="site-shell">
      {showIntro ? <IntroLoader /> : null}
      <AnnouncementBar />
      <SiteHeader />
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
      <MobileDock />
      {ui.toast ? <Toast /> : null}
    </div>
  );
}
