import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../store";
import { defaultCatalogFilters } from "../utils";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

export default function ShopPage() {
  const { homeData, products, catalogMeta, loadCatalog, ui } = useStore();
  const location = useLocation();
  const categoryFromQuery = new URLSearchParams(location.search).get("category") || "";
  const categories = homeData?.categories || [];
  const [filters, setFilters] = useState({
    ...defaultCatalogFilters,
    search: "",
    category: categoryFromQuery,
    sort: "newest"
  });

  useEffect(() => {
    setFilters((current) => ({ ...current, category: categoryFromQuery }));
  }, [categoryFromQuery]);

  useEffect(() => {
    loadCatalog(filters);
  }, [filters, loadCatalog]);

  const selectedCategory = categories.find((category) => category.slug === filters.category);
  const sortLabelMap = {
    newest: "Newest first",
    "price-low": "Price low to high",
    "price-high": "Price high to low",
    rating: "Highest rated"
  };
  const activeFilterCount = [
    filters.search.trim(),
    filters.category,
    filters.featured === "true" ? "featured" : ""
  ].filter(Boolean).length;
  const resetFilters = () =>
    setFilters({
      ...defaultCatalogFilters
    });

  return (
    <section className="section shop-page">
      <div className="shop-hero">
        <div className="page-heading page-heading--shop">
          <div>
            <p className="eyebrow">Shop</p>
            <h1>Full Collection</h1>
          </div>
          <p>
            Dresses, tailoring, and easy separates with a cleaner line, a
            brighter white base, and navy depth where the mood needs it.
          </p>
        </div>
        <div className="shop-hero__panel">
          <p className="eyebrow">Shop Mood</p>
          <strong>{selectedCategory?.name || "Full Collection"}</strong>
          <p>
            {selectedCategory?.description ||
              "Move through occasion dressing, softer tailoring, and everyday pieces without losing the polish."}
          </p>
          <div className="shop-hero__facts">
            <span>{catalogMeta.total} pieces live</span>
            <span>{sortLabelMap[filters.sort]}</span>
          </div>
        </div>
      </div>

      <div className="shop-categories">
        <div className="shop-categories__intro">
          <p className="eyebrow">Categories</p>
          <h2>Choose the mood first</h2>
          <p>
            Start with the moment, the silhouette, or the kind of finish you
            want, then let the edit narrow around it.
          </p>
        </div>
        <div className="shop-rail">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className={`shop-rail__item ${filters.category === category.slug ? "is-active" : ""}`}
            >
              <div
                className="shop-rail__media"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(11, 28, 52, 0.08), rgba(11, 28, 52, 0.5)), url(${category.image})`
                }}
              >
                <span className="shop-rail__tag">
                  {filters.category === category.slug ? "Current edit" : "Shop"}
                </span>
              </div>
              <div className="shop-rail__copy">
                <span>{category.name}</span>
                <small>{category.description}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="catalog-layout catalog-layout--shop">
        <aside className="filters-panel filters-panel--shop">
          <div className="filters-panel__intro">
            <p className="eyebrow">Refine The Rail</p>
            <h2>Find the right line faster</h2>
            <p>
              Narrow the edit by mood, category, and signature pieces without
              losing the calm feel of the page.
            </p>
          </div>

          <label>
            Search
            <input
              type="search"
              placeholder="Search dresses, sets, tailoring..."
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({ ...current, search: event.target.value }))
              }
            />
          </label>
          <label>
            Category
            <select
              value={filters.category}
              onChange={(event) =>
                setFilters((current) => ({ ...current, category: event.target.value }))
              }
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort by
            <select
              value={filters.sort}
              onChange={(event) =>
                setFilters((current) => ({ ...current, sort: event.target.value }))
              }
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </label>

          <div className="filters-panel__actions">
            <button
              type="button"
              className={`filter-pill ${filters.featured === "true" ? "is-active" : ""}`}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  featured: current.featured === "true" ? "" : "true"
                }))
              }
            >
              House signatures
            </button>
            {activeFilterCount ? (
              <button
                type="button"
                className="button button--secondary button--compact"
                onClick={resetFilters}
              >
                Clear all
              </button>
            ) : null}
          </div>
        </aside>

        <div className="catalog-results">
          <div className="catalog-results__top">
            <div className="catalog-meta catalog-meta--shop">
              <span>{catalogMeta.total} pieces</span>
              <span>{ui.loading ? "Refreshing the rail" : "Ready to wear"}</span>
            </div>
            <div className="catalog-results__note">
              <strong>{selectedCategory?.name || "Curated for the full wardrobe"}</strong>
              <p>
                {selectedCategory?.description ||
                  "A balanced mix of dresses, tailoring, and polished separates in the same white-and-navy tone of the home page."}
              </p>
            </div>
          </div>

          {activeFilterCount ? (
            <div className="catalog-active">
              {filters.search.trim() ? (
                <button
                  type="button"
                  className="catalog-chip"
                  onClick={() => setFilters((current) => ({ ...current, search: "" }))}
                >
                  Search: {filters.search.trim()}
                </button>
              ) : null}
              {selectedCategory ? (
                <button
                  type="button"
                  className="catalog-chip"
                  onClick={() => setFilters((current) => ({ ...current, category: "" }))}
                >
                  {selectedCategory.name}
                </button>
              ) : null}
              {filters.featured === "true" ? (
                <button
                  type="button"
                  className="catalog-chip"
                  onClick={() => setFilters((current) => ({ ...current, featured: "" }))}
                >
                  House signatures
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="catalog-results__surface">
            <div className="catalog-results__header">
              <div>
                <p className="eyebrow">Current Edit</p>
                <h2>{selectedCategory?.name || "Full Collection"}</h2>
                <p>
                  {selectedCategory?.description ||
                    "A clearer mix of occasion dressing, softer tailoring, and polished everyday pieces."}
                </p>
              </div>
              <div className="catalog-results__stats">
                <span>{products.length} visible now</span>
                <span>
                  {filters.featured === "true" ? "House signatures only" : "Freshly arranged"}
                </span>
              </div>
            </div>

            <div className="product-grid product-grid--shop">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {!products.length ? (
              <EmptyState
                title="No pieces match those filters"
                body="Try another search term or clear the featured filter to widen the edit."
                actionLabel="Reset filters"
                actionTo="/shop"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
