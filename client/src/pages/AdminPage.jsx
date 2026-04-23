import { useState, useEffect } from "react";
import { useStore } from "../store";
import { formatCurrency, emptyProductDraft } from "../utils";
import PageLoader from "../components/PageLoader";
import EmptyState from "../components/EmptyState";
import Field from "../components/Field";
import StatusPill from "../components/StatusPill";

export default function AdminPage() {
  const {
    authConfigured,
    authLoaded,
    isSignedIn,
    user,
    dashboard,
    loadDashboard,
    saveProduct,
    setOrderStatus,
    ui
  } = useStore();
  const [draft, setDraft] = useState(emptyProductDraft);
  const [editingSlug, setEditingSlug] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      loadDashboard();
    }
  }, [loadDashboard, user]);

  if (!authConfigured) {
    return (
      <section className="section">
        <EmptyState title="Clerk is not connected yet" body="Add your Clerk keys before opening the admin dashboard." actionLabel="Back to home" actionTo="/" />
      </section>
    );
  }

  if (!authLoaded || (isSignedIn && !user)) {
    return <PageLoader label="Checking admin access" />;
  }

  if (!user) {
    return (
      <section className="section">
        <EmptyState title="Admin access requires sign in" body="Sign in with an account that has admin role set in Clerk Public Metadata to access the dashboard." actionLabel="Go to sign in" actionTo="/auth" />
      </section>
    );
  }

  if (user.role !== "admin") {
    return (
      <section className="section">
        <EmptyState title="This area is for admin users" body="The customer account flow works, but inventory and order controls stay behind admin authorization." actionLabel="Back to account" actionTo="/account" />
      </section>
    );
  }

  const handleEdit = (product) => {
    setEditingSlug(product.slug);
    setDraft({
      title: product.title,
      slug: product.slug,
      subtitle: product.subtitle || "",
      description: product.description || "",
      category: product.category,
      price: product.price,
      compareAtPrice: product.compareAtPrice || "",
      fabric: product.fabric || "",
      fit: product.fit || "",
      care: product.care || "",
      featured: product.featured,
      newArrival: product.newArrival,
      badgesText: (product.badges || []).join(", "),
      tagsText: (product.tags || []).join(", "),
      imagesText: (product.images || []).join("\n"),
      variantsText: (product.variants || [])
        .map((v) => `${v.sku}, ${v.color}, ${v.size}, ${v.stock}`)
        .join("\n")
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await saveProduct(
        {
          title: draft.title,
          slug: draft.slug,
          subtitle: draft.subtitle,
          description: draft.description,
          category: draft.category,
          price: Number(draft.price),
          compareAtPrice: Number(draft.compareAtPrice),
          fabric: draft.fabric,
          fit: draft.fit,
          care: draft.care,
          featured: draft.featured,
          newArrival: draft.newArrival,
          badges: draft.badgesText.split(",").map((i) => i.trim()).filter(Boolean),
          tags: draft.tagsText.split(",").map((i) => i.trim()).filter(Boolean),
          images: draft.imagesText.split("\n").map((i) => i.trim()).filter(Boolean),
          variants: draft.variantsText.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
            const [sku, color, size, stock] = line.split(",").map((p) => p.trim());
            return { sku, color, size, stock: Number(stock) || 0 };
          })
        },
        editingSlug
      );
      setDraft(emptyProductDraft);
      setEditingSlug("");
    } catch (caughtError) {
      setError(caughtError.message);
    }
  };

  return (
    <section className="section admin-layout">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Merchandising, inventory, and order control in one place</h1>
        </div>
        <p>This admin workspace is already connected to the same backend powering the storefront, so product edits and order changes flow through a real API instead of local-only mocks.</p>
      </div>

      <div className="stat-grid">
        {(dashboard?.stats || []).map((stat) => (
          <article key={stat.label} className="stat-card">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="admin-panels">
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>{editingSlug ? "Edit product" : "Create product"}</h2>
            <button type="button" className="link-button" onClick={() => { setEditingSlug(""); setDraft(emptyProductDraft); }}>Reset form</button>
          </div>
          {error ? <div className="inline-error">{error}</div> : null}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <Field label="Title" value={draft.title} onChange={(v) => setDraft((c) => ({ ...c, title: v }))} />
              <Field label="Slug" value={draft.slug} onChange={(v) => setDraft((c) => ({ ...c, slug: v }))} />
              <Field label="Category" value={draft.category} onChange={(v) => setDraft((c) => ({ ...c, category: v }))} />
              <Field label="Price" type="number" value={draft.price} onChange={(v) => setDraft((c) => ({ ...c, price: v }))} />
              <Field label="Compare at" type="number" value={draft.compareAtPrice} onChange={(v) => setDraft((c) => ({ ...c, compareAtPrice: v }))} />
              <Field label="Subtitle" value={draft.subtitle} onChange={(v) => setDraft((c) => ({ ...c, subtitle: v }))} />
            </div>
            <label>Description<textarea rows="4" value={draft.description} onChange={(e) => setDraft((c) => ({ ...c, description: e.target.value }))} /></label>
            <div className="form-grid">
              <Field label="Fabric" value={draft.fabric} onChange={(v) => setDraft((c) => ({ ...c, fabric: v }))} />
              <Field label="Fit" value={draft.fit} onChange={(v) => setDraft((c) => ({ ...c, fit: v }))} />
              <Field label="Care" value={draft.care} onChange={(v) => setDraft((c) => ({ ...c, care: v }))} />
            </div>
            <div className="checkbox-row">
              <label><input type="checkbox" checked={draft.featured} onChange={(e) => setDraft((c) => ({ ...c, featured: e.target.checked }))} /> Featured</label>
              <label><input type="checkbox" checked={draft.newArrival} onChange={(e) => setDraft((c) => ({ ...c, newArrival: e.target.checked }))} /> New arrival</label>
            </div>
            <label>Badges<input value={draft.badgesText} onChange={(e) => setDraft((c) => ({ ...c, badgesText: e.target.value }))} placeholder="Best Seller, Limited Restock" /></label>
            <label>Tags<input value={draft.tagsText} onChange={(e) => setDraft((c) => ({ ...c, tagsText: e.target.value }))} placeholder="dress, occasion, satin" /></label>
            <label>Image URLs<textarea rows="4" value={draft.imagesText} onChange={(e) => setDraft((c) => ({ ...c, imagesText: e.target.value }))} placeholder="One image URL per line" /></label>
            <label>Variants<textarea rows="5" value={draft.variantsText} onChange={(e) => setDraft((c) => ({ ...c, variantsText: e.target.value }))} placeholder="SKU, Color, Size, Stock" /></label>
            <button className="button button--primary" type="submit" disabled={ui.loading}>
              {ui.loading ? "Saving..." : editingSlug ? "Update product" : "Create product"}
            </button>
          </form>
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Inventory snapshot</h2>
            <span>{dashboard?.products?.length || 0} products</span>
          </div>
          <div className="inventory-list">
            {(dashboard?.products || []).map((product) => (
              <article key={product.id} className="inventory-item">
                <div>
                  <strong>{product.title}</strong>
                  <span>{product.category} - {formatCurrency(product.price)}</span>
                </div>
                <div className="inventory-actions">
                  <span>{product.inventoryCount} in stock</span>
                  <button type="button" className="link-button" onClick={() => handleEdit(product)}>Edit</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="admin-panels">
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Recent orders</h2>
            <span>{dashboard?.recentOrders?.length || 0} recent</span>
          </div>
          <div className="order-stack">
            {(dashboard?.recentOrders || []).map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-card__head">
                  <div>
                    <strong>{order.orderNumber}</strong>
                    <span>{order.customer.name}</span>
                  </div>
                  <StatusPill value={order.status} />
                </div>
                <div className="summary-line">
                  <span>{formatCurrency(order.pricing.total)}</span>
                  <span>{order.payment.provider}</span>
                </div>
                <div className="order-actions">
                  {["pending", "confirmed", "shipped", "delivered"].map((status) => (
                    <button key={status} type="button" className={`chip ${order.status === status ? "is-active" : ""}`} onClick={() => setOrderStatus(order.id, status)}>{status}</button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Low stock watchlist</h2>
            <span>{dashboard?.lowStockProducts?.length || 0} products</span>
          </div>
          <div className="inventory-list">
            {(dashboard?.lowStockProducts || []).map((product) => (
              <article key={product.id} className="inventory-item">
                <div>
                  <strong>{product.title}</strong>
                  <span>{product.variants.map((v) => `${v.color} ${v.size}: ${v.stock}`).join(" | ")}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
