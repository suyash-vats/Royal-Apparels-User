import { useEffect, useMemo } from "react";
import { useStore } from "../store";
import { defaultCatalogFilters } from "../utils";
import PageLoader from "../components/PageLoader";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

export default function SavedPage() {
  const { products, wishlist, loadCatalog, ui } = useStore();

  useEffect(() => {
    loadCatalog(defaultCatalogFilters);
  }, [loadCatalog]);

  const savedProducts = useMemo(
    () => products.filter((product) => wishlist.includes(product.slug)),
    [products, wishlist]
  );

  if (ui.loading && !products.length) {
    return <PageLoader label="Loading saved pieces" />;
  }

  return (
    <section className="section shop-page saved-page">
      <div className="page-heading page-heading--shop">
        <div>
          <p className="eyebrow">Saved</p>
          <h1>Your Saved Pieces</h1>
        </div>
        <p>
          Keep the styles you want close, then move them into the bag when you
          are ready to finish the order.
        </p>
      </div>

      <div className="catalog-results">
        <div className="catalog-results__surface">
          <div className="catalog-results__header">
            <div>
              <p className="eyebrow">Saved Edit</p>
              <h2>{savedProducts.length ? "Ready when you are" : "Nothing saved yet"}</h2>
              <p>
                {savedProducts.length
                  ? "All the pieces you marked for later live here, ready for a second look or a quick move to bag."
                  : "Save a few pieces from the shop and they will collect here for an easier return."}
              </p>
            </div>
            <div className="catalog-results__stats">
              <span>{savedProducts.length} saved now</span>
              <span>{savedProducts.length ? "Bag the ones you love" : "Start exploring"}</span>
            </div>
          </div>

          {savedProducts.length ? (
            <div className="product-grid product-grid--shop">
              {savedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No saved pieces yet"
              body="Browse the shop, tap save on the styles you want to come back to, and they will appear here."
              actionLabel="Explore the shop"
              actionTo="/shop"
            />
          )}
        </div>
      </div>
    </section>
  );
}
