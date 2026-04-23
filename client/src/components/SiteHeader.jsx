import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useStore } from "../store";
import { BRAND_NAME, navItems } from "../utils";

export default function SiteHeader() {
  const { cartCount, wishlist, user, setUi, logout } = useStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const accountPath = user ? "/account" : "/auth";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen((current) => !current)}
        >
          Menu
        </button>
        <Link to="/" className="brand-mark">
          <span>{BRAND_NAME}</span>
          <small>Women&apos;s fashion</small>
        </Link>
        <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to={accountPath}
            className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
          >
            Account
          </NavLink>
        </nav>
        <div className="site-actions">
          <Link to="/saved" className="site-action">
            Saved {wishlist.length}
          </Link>
          <Link to={accountPath} className="site-action">
            {user ? user.name.split(" ")[0] : "Sign in"}
          </Link>
          {user ? (
            <button type="button" className="site-action site-action--ghost" onClick={logout}>
              Logout
            </button>
          ) : null}
          <button
            type="button"
            className="site-action site-action--bag"
            onClick={() =>
              setUi((current) => ({
                ...current,
                isCartOpen: !current.isCartOpen
              }))
            }
          >
            Bag {cartCount}
          </button>
        </div>
      </div>
    </header>
  );
}
