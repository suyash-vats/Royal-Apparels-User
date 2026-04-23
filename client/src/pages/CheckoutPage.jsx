import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { formatCurrency } from "../utils";
import EmptyState from "../components/EmptyState";
import Field from "../components/Field";

export default function CheckoutPage() {
  const { cart, cartTotals, createOrder, lastOrder, user, ui } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    line1: user?.addresses?.[0]?.line1 || "",
    line2: user?.addresses?.[0]?.line2 || "",
    city: user?.addresses?.[0]?.city || "",
    state: user?.addresses?.[0]?.state || "",
    postalCode: user?.addresses?.[0]?.postalCode || "",
    paymentMethod: "razorpay",
    deliveryNote: ""
  });
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: user?.name || current.name,
      email: user?.email || current.email,
      phone: user?.phone || current.phone
    }));
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const order = await createOrder({
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone
        },
        shippingAddress: {
          label: "Home",
          fullName: form.name,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: "India"
        },
        paymentMethod: form.paymentMethod,
        deliveryNote: form.deliveryNote
      });
      setConfirmation(order);
    } catch (caughtError) {
      setError(caughtError.message);
    }
  };

  if (confirmation || lastOrder) {
    const order = confirmation || lastOrder;
    return (
      <section className="section">
        <div className="confirmation-panel">
          <p className="eyebrow">Order confirmed</p>
          <h1>{order.orderNumber}</h1>
          <p>
            Thank you. A confirmation is on its way, and your order is now in
            line for dispatch through {order.payment.provider}.
          </p>
          <div className="detail-grid">
            <div>
              <strong>Total</strong>
              <p>{formatCurrency(order.pricing.total)}</p>
            </div>
            <div>
              <strong>Status</strong>
              <p>{order.status}</p>
            </div>
            <div>
              <strong>Placed on</strong>
              <p>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <div>
              <strong>Email</strong>
              <p>{order.customer.email}</p>
            </div>
          </div>
          <div className="hero__actions">
            <Link to="/shop" className="button button--primary">
              Continue shopping
            </Link>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => navigate(user ? "/account" : "/auth")}
            >
              {user ? "View account" : "Sign in"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section checkout-layout">
      <div className="checkout-main">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Checkout</p>
            <h1>One last step, then it is yours</h1>
          </div>
          <p>
            A calm, quick finish with delivery details first and payment next.
          </p>
        </div>
        {error ? <div className="inline-error">{error}</div> : null}
        {!cart.length ? (
          <EmptyState
            title="Your bag is empty"
            body="Add a few products first so the checkout has something to work with."
            actionLabel="Shop now"
            actionTo="/shop"
          />
        ) : (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <Field
                label="Full name"
                value={form.name}
                onChange={(value) => setForm((current) => ({ ...current, name: value }))}
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => setForm((current) => ({ ...current, email: value }))}
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
              />
              <Field
                label="State"
                value={form.state}
                onChange={(value) => setForm((current) => ({ ...current, state: value }))}
              />
              <Field
                label="Address line 1"
                value={form.line1}
                onChange={(value) => setForm((current) => ({ ...current, line1: value }))}
              />
              <Field
                label="Address line 2"
                value={form.line2}
                onChange={(value) => setForm((current) => ({ ...current, line2: value }))}
              />
              <Field
                label="City"
                value={form.city}
                onChange={(value) => setForm((current) => ({ ...current, city: value }))}
              />
              <Field
                label="Postal code"
                value={form.postalCode}
                onChange={(value) =>
                  setForm((current) => ({ ...current, postalCode: value }))
                }
              />
            </div>

            <label>
              Delivery note
              <textarea
                rows="3"
                value={form.deliveryNote}
                onChange={(event) =>
                  setForm((current) => ({ ...current, deliveryNote: event.target.value }))
                }
              />
            </label>

            <div className="payment-options">
              {[
                ["razorpay", "Razorpay"],
                ["stripe", "Stripe"],
                ["cod", "Cash on Delivery"]
              ].map(([value, label]) => (
                <label key={value} className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={form.paymentMethod === value}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        paymentMethod: event.target.value
                      }))
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <button type="submit" className="button button--primary" disabled={ui.loading}>
              {ui.loading ? "Placing order..." : "Place order"}
            </button>
          </form>
        )}
      </div>

      <aside className="checkout-summary">
        <h3>Order summary</h3>
        <div className="summary-stack">
          {cart.map((item) => (
            <article key={item.id} className="summary-item">
              <img src={item.image} alt={item.title} />
              <div>
                <strong>{item.title}</strong>
                <span>
                  {item.color} / {item.size}
                </span>
              </div>
              <span>
                {item.quantity} x {formatCurrency(item.price)}
              </span>
            </article>
          ))}
        </div>
        <div className="summary-line">
          <span>Subtotal</span>
          <strong>{formatCurrency(cartTotals.subtotal)}</strong>
        </div>
        <div className="summary-line">
          <span>Shipping</span>
          <strong>{cartTotals.shipping ? formatCurrency(cartTotals.shipping) : "Free"}</strong>
        </div>
        <div className="summary-line">
          <span>Tax</span>
          <strong>{formatCurrency(cartTotals.tax)}</strong>
        </div>
        <div className="summary-line">
          <span>Discount</span>
          <strong>- {formatCurrency(cartTotals.discount)}</strong>
        </div>
        <div className="summary-line summary-line--total">
          <span>Total</span>
          <strong>{formatCurrency(cartTotals.total)}</strong>
        </div>
      </aside>
    </section>
  );
}
