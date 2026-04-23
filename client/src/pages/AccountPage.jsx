import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { formatCurrency, formatDate } from "../utils";
import PageLoader from "../components/PageLoader";
import EmptyState from "../components/EmptyState";
import Field from "../components/Field";
import StatusPill from "../components/StatusPill";

const buildFormFromUser = (user) => {
  const primaryAddress = user?.addresses?.[0] || {};

  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    line1: primaryAddress.line1 || "",
    line2: primaryAddress.line2 || "",
    city: primaryAddress.city || "",
    state: primaryAddress.state || "",
    postalCode: primaryAddress.postalCode || ""
  };
};

export default function AccountPage() {
  const {
    authConfigured,
    authLoaded,
    isSignedIn,
    user,
    orders,
    products,
    wishlist,
    cartCount,
    updateProfile,
    ui
  } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(buildFormFromUser(null));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm(buildFormFromUser(user));
    }
  }, [user]);

  const firstName = useMemo(
    () => user?.name?.trim()?.split(/\s+/)?.[0] || "there",
    [user]
  );

  const savedProducts = useMemo(
    () => products.filter((product) => wishlist.includes(product.slug)).slice(0, 3),
    [products, wishlist]
  );

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (left, right) =>
          new Date(right.createdAt || 0).getTime() -
          new Date(left.createdAt || 0).getTime()
      ),
    [orders]
  );

  const totalSpend = useMemo(
    () =>
      sortedOrders.reduce(
        (total, order) => total + Number(order.pricing?.total || 0),
        0
      ),
    [sortedOrders]
  );

  const latestOrder = sortedOrders[0] || null;
  const primaryAddress = user?.addresses?.[0] || null;
  const hasAddress = Boolean(
    form.line1 || form.line2 || form.city || form.state || form.postalCode
  );

  if (!authLoaded) {
    return <PageLoader label="Opening your account" />;
  }

  if (!authConfigured) {
    return (
      <section className="section">
        <EmptyState
          title="Clerk is not connected yet"
          body="Add your Clerk publishable key in the client environment file to turn on secure customer accounts."
          actionLabel="Back to home"
          actionTo="/"
        />
      </section>
    );
  }

  if (isSignedIn && !user) {
    return <PageLoader label="Syncing your account" />;
  }

  if (!user) {
    return (
      <section className="section">
        <EmptyState
          title="Sign in to view your account"
          body="Keep your details close, revisit past orders, and move through checkout a little faster next time."
          actionLabel="Go to sign in"
          actionTo="/auth"
        />
      </section>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const addresses = hasAddress
      ? [
          {
            label: "Primary",
            fullName: user.name,
            phone: form.phone,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: "India"
          }
        ]
      : [];

    try {
      await updateProfile({
        phone: form.phone,
        addresses
      });
      setMessage("Account details updated.");
    } catch (caughtError) {
      setError(caughtError.message);
    }
  };

  return (
    <section className="section account-shell">
      <div className="account-overview">
        <div className="account-overview__copy">
          <p className="eyebrow">Account</p>
          <h1>Welcome back, {firstName}</h1>
          <p>
            Keep delivery details ready, check the status of recent orders, and
            jump back into the pieces you saved for later.
          </p>
        </div>
        <div className="account-overview__actions">
          <Link to="/shop" className="button button--primary">
            Shop new arrivals
          </Link>
          <Link to="/saved" className="button button--secondary">
            Open saved
          </Link>
          {user.role === "admin" ? (
            <button
              type="button"
              className="button button--secondary"
              onClick={() => navigate("/admin")}
            >
              Open admin
            </button>
          ) : null}
        </div>
        <div className="account-stat-grid">
          <article className="account-stat">
            <span>Orders placed</span>
            <strong>{sortedOrders.length}</strong>
            <small>{latestOrder ? `Latest on ${formatDate(latestOrder.createdAt)}` : "No order yet"}</small>
          </article>
          <article className="account-stat">
            <span>Total spend</span>
            <strong>{formatCurrency(totalSpend)}</strong>
            <small>{sortedOrders.length ? "Across every confirmed checkout" : "Starts with your first order"}</small>
          </article>
          <article className="account-stat">
            <span>Saved pieces</span>
            <strong>{wishlist.length}</strong>
            <small>{wishlist.length ? "Ready for another look" : "Build your shortlist"}</small>
          </article>
          <article className="account-stat">
            <span>Bag now</span>
            <strong>{cartCount}</strong>
            <small>{cartCount ? "Already waiting at checkout" : "Nothing in bag yet"}</small>
          </article>
        </div>
      </div>

      <div className="account-dashboard">
        <div className="account-panel account-panel--saved">
          <div className="panel-heading account-panel__heading">
            <div>
              <p className="eyebrow">Saved Edit</p>
              <h2>Pieces you are still considering</h2>
            </div>
            <Link to="/saved" className="account-link">
              View all saved
            </Link>
          </div>
          {savedProducts.length ? (
            <div className="account-saved-grid">
              {savedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="account-saved-item"
                >
                  <img src={product.images[0]} alt={product.title} />
                  <div>
                    <strong>{product.title}</strong>
                    <span>{product.subtitle}</span>
                    <small>{formatCurrency(product.price)}</small>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="account-inline-empty">
              <strong>No saved pieces yet</strong>
              <p>Save styles from the shop and they will stay ready here.</p>
            </div>
          )}
        </div>

        <div className="account-panel account-panel--details">
          <div className="panel-heading account-panel__heading">
            <div>
              <p className="eyebrow">Profile + Delivery</p>
              <h2>Your details</h2>
            </div>
            <span className="account-note">Name and email stay managed by Clerk.</span>
          </div>

          {message ? <div className="inline-success">{message}</div> : null}
          {error ? <div className="inline-error">{error}</div> : null}

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <Field label="Name" value={form.name} readOnly />
              <Field label="Email" type="email" value={form.email} readOnly />
              <Field
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                  setForm((current) => ({ ...current, phone: value }))
                }
              />
              <Field
                label="Address line 1"
                value={form.line1}
                onChange={(value) =>
                  setForm((current) => ({ ...current, line1: value }))
                }
              />
              <Field
                label="Address line 2"
                value={form.line2}
                onChange={(value) =>
                  setForm((current) => ({ ...current, line2: value }))
                }
              />
              <Field
                label="City"
                value={form.city}
                onChange={(value) =>
                  setForm((current) => ({ ...current, city: value }))
                }
              />
              <Field
                label="State"
                value={form.state}
                onChange={(value) =>
                  setForm((current) => ({ ...current, state: value }))
                }
              />
              <Field
                label="Postal code"
                value={form.postalCode}
                onChange={(value) =>
                  setForm((current) => ({ ...current, postalCode: value }))
                }
              />
            </div>
            <button className="button button--primary" type="submit" disabled={ui.loading}>
              {ui.loading ? "Saving..." : "Save account details"}
            </button>
          </form>
        </div>

        <div className="account-panel account-panel--support">
          <div className="panel-heading account-panel__heading">
            <div>
              <p className="eyebrow">Quick Access</p>
              <h2>Everything you usually need</h2>
            </div>
          </div>

          <div className="account-helper-list">
            <Link to="/shop" className="account-helper-item">
              <strong>Keep shopping</strong>
              <span>New arrivals, tailoring, and occasion pieces</span>
            </Link>
            <Link to="/saved" className="account-helper-item">
              <strong>Review saved pieces</strong>
              <span>{wishlist.length ? `${wishlist.length} styles waiting for a second look` : "Start building your shortlist"}</span>
            </Link>
            <Link to="/checkout" className="account-helper-item">
              <strong>Finish checkout</strong>
              <span>{cartCount ? `${cartCount} items already in your bag` : "Your next order can start here"}</span>
            </Link>
          </div>

          <div className="account-address-summary">
            <p className="eyebrow">Primary delivery</p>
            {primaryAddress ? (
              <>
                <strong>{primaryAddress.line1}</strong>
                <span>
                  {[primaryAddress.city, primaryAddress.state, primaryAddress.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </>
            ) : (
              <>
                <strong>No address saved yet</strong>
                <span>Add one above to make checkout feel much faster.</span>
              </>
            )}
          </div>
        </div>

        <div className="account-panel account-panel--orders">
          <div className="panel-heading account-panel__heading">
            <div>
              <p className="eyebrow">Order History</p>
              <h2>Your recent orders</h2>
            </div>
            {latestOrder ? (
              <span className="account-note">
                Last order {latestOrder.orderNumber}
              </span>
            ) : null}
          </div>

          {sortedOrders.length ? (
            <div className="account-order-list">
              {sortedOrders.map((order) => (
                <article key={order.id} className="account-order-card">
                  <div className="account-order-card__top">
                    <div>
                      <strong>{order.orderNumber}</strong>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="account-order-card__status">
                      <span className="account-chip">
                        Payment {order.payment?.status || "pending"}
                      </span>
                      <StatusPill value={order.status} />
                    </div>
                  </div>

                  <div className="account-order-items">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.sku} className="account-order-item">
                        <img src={item.image} alt={item.title} />
                        <div>
                          <strong>{item.title}</strong>
                          <span>
                            {item.color} / {item.size}
                          </span>
                        </div>
                        <small>
                          {item.quantity} x {formatCurrency(item.price)}
                        </small>
                      </div>
                    ))}
                  </div>

                  <div className="account-order-meta">
                    <span>{order.items.length} items</span>
                    <strong>{formatCurrency(order.pricing.total)}</strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No orders yet"
              body="Once you complete checkout, your latest purchases will show up here with payment and delivery status."
              actionLabel="Start shopping"
              actionTo="/shop"
            />
          )}
        </div>
      </div>
    </section>
  );
}
