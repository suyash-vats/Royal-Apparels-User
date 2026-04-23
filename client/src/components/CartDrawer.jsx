import { Link } from "react-router-dom";
import { useStore } from "../store";
import { formatCurrency } from "../utils";
import EmptyState from "./EmptyState";

export default function CartDrawer() {
  const { cart, cartTotals, ui, setUi, updateCartItem, removeCartItem } = useStore();

  return (
    <div className={`drawer-shell ${ui.isCartOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="drawer-backdrop"
        onClick={() => setUi((current) => ({ ...current, isCartOpen: false }))}
      />
      <aside className="cart-drawer">
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Bag</p>
            <h3>Your picks</h3>
          </div>
          <button
            type="button"
            className="link-button"
            onClick={() => setUi((current) => ({ ...current, isCartOpen: false }))}
          >
            Close
          </button>
        </div>
        <div className="drawer-body">
          {cart.length ? (
            cart.map((item) => (
              <article key={item.id} className="drawer-item">
                <img src={item.image} alt={item.title} />
                <div>
                  <h4>{item.title}</h4>
                  <p>
                    {item.color} / {item.size}
                  </p>
                  <span>{formatCurrency(item.price)}</span>
                  <div className="quantity-row">
                    <button
                      type="button"
                      onClick={() => updateCartItem(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => removeCartItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              title="Your bag is empty"
              body="Start with a few polished essentials and your checkout will feel much more exciting."
              actionLabel="Explore the shop"
              actionTo="/shop"
            />
          )}
        </div>
        <div className="drawer-footer">
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>{formatCurrency(cartTotals.subtotal)}</strong>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <strong>{cartTotals.shipping ? formatCurrency(cartTotals.shipping) : "Free"}</strong>
          </div>
          <Link
            to="/checkout"
            className="button button--primary button--full"
            onClick={() => setUi((current) => ({ ...current, isCartOpen: false }))}
          >
            Go to checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
