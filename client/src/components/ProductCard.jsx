import { Link } from "react-router-dom";
import { useStore } from "../store";
import { formatCurrency } from "../utils";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const firstVariant = product.variants[0];

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card__media">
        <img src={product.images[0]} alt={product.title} />
        {product.images[1] ? (
          <img
            src={product.images[1]}
            alt={product.title}
            className="product-card__media-alt"
          />
        ) : null}
        {product.badges?.[0] ? <span className="product-badge">{product.badges[0]}</span> : null}
      </Link>
      <div className="product-card__body">
        <div className="product-card__copy">
          <span className="product-card__eyebrow">{product.category.replace("-", " ")}</span>
          <Link to={`/products/${product.slug}`}>
            <h3>{product.title}</h3>
          </Link>
          <p>{product.subtitle}</p>
        </div>
        <div className="product-card__meta">
          <div>
            <strong>{formatCurrency(product.price)}</strong>
            <span>{product.availableColors.join(" / ")}</span>
          </div>
          <span>
            {product.rating} rating
          </span>
        </div>
        <div className="product-card__actions">
          <button
            type="button"
            className="button button--primary button--compact"
            onClick={() =>
              addToCart({
                product,
                color: firstVariant.color,
                size: firstVariant.size,
                quantity: 1
              })
            }
          >
            Add to bag
          </button>
          <button
            type="button"
            className="button button--secondary button--compact"
            onClick={() => toggleWishlist(product.slug)}
          >
            {wishlist.includes(product.slug) ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
}
