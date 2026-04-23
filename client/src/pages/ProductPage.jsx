import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store";
import { formatCurrency, getUnique } from "../utils";
import PageLoader from "../components/PageLoader";
import EmptyState from "../components/EmptyState";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import Stars from "../components/Stars";

export default function ProductPage() {
  const { slug } = useParams();
  const { loadProduct, addToCart, toggleWishlist, wishlist, products } = useStore();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    loadProduct(slug)
      .then((data) => {
        if (!active) {
          return;
        }
        setProduct(data);
        setSelectedColor(data.availableColors[0] || data.variants[0]?.color || "");
      })
      .catch((caughtError) => {
        if (!active) {
          return;
        }
        setError(caughtError.message);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [loadProduct, slug]);

  const sizeOptions = useMemo(() => {
    if (!product) {
      return [];
    }
    return getUnique(
      product.variants
        .filter((variant) => variant.color === selectedColor)
        .map((variant) => variant.size)
    );
  }, [product, selectedColor]);

  useEffect(() => {
    if (sizeOptions.length && !sizeOptions.includes(selectedSize)) {
      setSelectedSize(sizeOptions[0]);
    }
  }, [selectedSize, sizeOptions]);

  if (loading) {
    return <PageLoader label="Loading product details" />;
  }

  if (error || !product) {
    return (
      <section className="section">
        <EmptyState
          title="We couldn't load that product"
          body={error || "Please head back to the shop and try again."}
          actionLabel="Back to shop"
          actionTo="/shop"
        />
      </section>
    );
  }

  const selectedVariant =
    product.variants.find(
      (variant) => variant.color === selectedColor && variant.size === selectedSize
    ) || product.variants[0];
  const relatedProducts = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <section className="section product-layout product-layout--editorial">
        <div className="product-gallery">
          <div className="product-gallery__hero">
            <img src={product.images[0]} alt={product.title} />
          </div>
          <div className="product-gallery__rail">
            {product.images.slice(1).map((image) => (
              <img key={image} src={image} alt={product.title} />
            ))}
          </div>
        </div>
        <div className="product-copy">
          <div className="product-copy__topline">
            <p className="eyebrow">{product.category.replace("-", " ")}</p>
            {product.badges?.length ? (
              <span className="product-copy__badge">{product.badges[0]}</span>
            ) : null}
          </div>
          <h1>{product.title}</h1>
          <p className="product-subtitle">{product.subtitle}</p>
          <div className="product-note-strip">
            <span>Express dispatch</span>
            <span>Easy exchange</span>
            <span>Sizes move quickly</span>
          </div>
          <div className="price-row">
            <strong>{formatCurrency(product.price)}</strong>
            <span>{formatCurrency(product.compareAtPrice)}</span>
          </div>
          <div className="rating-row">
            <Stars rating={product.rating} />
            <span>
              {product.rating} / 5 ({product.reviewCount} reviews)
            </span>
          </div>
          <p>{product.description}</p>

          <div className="selection-group">
            <label>Color</label>
            <div className="chip-row">
              {product.availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`chip ${selectedColor === color ? "is-active" : ""}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="selection-group">
            <label>Size</label>
            <div className="chip-row">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`chip ${selectedSize === size ? "is-active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="selection-group quantity-picker">
            <label>Quantity</label>
            <div className="quantity-row">
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((current) => current + 1)}>
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button
              type="button"
              className="button button--primary"
              onClick={() =>
                addToCart({
                  product,
                  color: selectedVariant.color,
                  size: selectedVariant.size,
                  quantity
                })
              }
            >
              Add to bag
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => toggleWishlist(product.slug)}
            >
              {wishlist.includes(product.slug) ? "Saved" : "Save for later"}
            </button>
          </div>
        </div>
      </section>

      <section className="section product-ritual">
        <div className="product-ritual__copy">
          <p className="eyebrow">Why it stays in rotation</p>
          <h2>Designed to feel striking the first time and easy every time after.</h2>
          <p>
            It works with city evenings, long lunches, last-minute plans, and
            the kind of wardrobe decisions you make in two minutes without
            looking hurried.
          </p>
        </div>
        <div className="detail-grid detail-grid--editorial">
          <div>
            <strong>Fabric</strong>
            <p>{product.fabric}</p>
          </div>
          <div>
            <strong>Fit</strong>
            <p>{product.fit}</p>
          </div>
          <div>
            <strong>Care</strong>
            <p>{product.care}</p>
          </div>
          <div>
            <strong>Ready now</strong>
            <p>{selectedVariant.stock} pieces in this size and shade.</p>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="section">
          <SectionHeading
            eyebrow="Pair It With"
            title="More pieces in the same mood"
          />
          <div className="product-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
