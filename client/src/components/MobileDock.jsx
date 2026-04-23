import { NavLink, useLocation } from "react-router-dom";
import { useStore } from "../store";

export default function MobileDock() {
  const { cartCount, user, setUi } = useStore();
  const location = useLocation();

  return (
    <nav className="mobile-dock">
      <NavLink to="/" className={({ isActive }) => (isActive ? "mobile-dock__link is-active" : "mobile-dock__link")}>
        Home
      </NavLink>
      <NavLink
        to="/shop"
        className={({ isActive }) => (isActive ? "mobile-dock__link is-active" : "mobile-dock__link")}
      >
        Shop
      </NavLink>
      <button
        type="button"
        className={`mobile-dock__link ${location.pathname === "/checkout" ? "is-active" : ""}`}
        onClick={() => setUi((current) => ({ ...current, isCartOpen: true }))}
      >
        Bag {cartCount}
      </button>
      <NavLink
        to={user ? "/account" : "/auth"}
        className={({ isActive }) => (isActive ? "mobile-dock__link is-active" : "mobile-dock__link")}
      >
        {user ? "Account" : "Sign in"}
      </NavLink>
    </nav>
  );
}
