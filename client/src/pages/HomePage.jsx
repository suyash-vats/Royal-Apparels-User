import { Link } from "react-router-dom";
import { useStore } from "../store";
import { BRAND_NAME, formatCurrency } from "../utils";
import PageLoader from "../components/PageLoader";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";

export default function HomePage() {
  const { homeData } = useStore();

  if (!homeData) {
    return <PageLoader label="Preparing the latest collection" />;
  }

  const leadCollection = homeData.collections[0];
  const spotlightProduct = homeData.featuredProducts[0];
  const curatedProducts = homeData.featuredProducts.slice(1, 4);
  const collectionTerms = [
    "Clean navy tailoring",
    "Soft white drape",
    "Evening layers",
    "City-ready dresses",
    "New season arrivals"
  ];

  return (
    <div className="landing-page">
      <section
        className="hero hero--navy"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(247, 249, 252, 0.96) 0%, rgba(247, 249, 252, 0.82) 46%, rgba(13, 35, 64, 0.18) 100%), url(${homeData.brandStory.heroImage})`
        }}
      >
        <div className="hero__content section">
          <div className="hero__intro">
            <p className="eyebrow">Spring Summer 2026</p>
            <span className="hero__stamp">A softer white, a deeper navy, and a cleaner line</span>
          </div>
          <div className="hero__layout hero__layout--navy">
            <div className="hero__main">
              <h1>Modern pieces with a calm navy kind of confidence.</h1>
              <p>
                {BRAND_NAME} is built around clean tailoring, fluid dresses,
                and polished separates that feel luminous in white and grounded
                in navy. Easy to wear, elegant to look at, and strong without
                noise.
              </p>
              <div className="hero__actions">
                <Link to="/shop" className="button button--primary">
                  Shop the collection
                </Link>
                <Link
                  to="/shop?category=work-edit"
                  className="button button--secondary"
                >
                  Explore the navy edit
                </Link>
              </div>
              <div className="hero__glance">
                <span>Refined fits</span>
                <span>Day to evening ease</span>
                <span>Express dispatch</span>
              </div>
              <div className="hero__note-card">
                <p className="eyebrow">Editors Pick</p>
                <strong>{spotlightProduct.title}</strong>
                <span>
                  Structured enough to feel dressed, soft enough to wear all
                  day.
                </span>
              </div>
            </div>
            <div className="hero__media">
              <div className="hero__media-float hero__media-float--top">
                <span>Fresh drop</span>
                <strong>12 new pieces this week</strong>
              </div>
              <div className="hero__media-panel">
                <img
                  src={spotlightProduct?.images?.[1] || spotlightProduct?.images?.[0] || leadCollection.image}
                  alt={spotlightProduct?.title || leadCollection.title}
                />
                {spotlightProduct ? (
                  <div className="hero__media-caption">
                    <span>Most loved now</span>
                    <strong>{spotlightProduct.title}</strong>
                    <small>{formatCurrency(spotlightProduct.price)}</small>
                  </div>
                ) : null}
              </div>
              <div className="hero__media-float hero__media-float--bottom">
                <span>Style with</span>
                <strong>{curatedProducts[0]?.title || "Tailored separates"}</strong>
              </div>
              <div className="hero__metrics hero__metrics--navy">
                {homeData.brandStory.metrics.map((metric) => (
                  <div key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ticker-band ticker-band--navy">
        <div className="ticker-band__track">
          {[...collectionTerms, ...collectionTerms].map((term, index) => (
            <span key={`${term}-${index}`}>{term}</span>
          ))}
        </div>
      </section>

      <section className="section section--feature-story landing-manifesto">
        <div className="feature-story feature-story--navy">
          <div className="feature-story__copy">
            <p className="eyebrow">The House Mood</p>
            <h2>Bright, polished, and memorable in all the right ways.</h2>
            <p>
              White keeps the page airy. Navy gives it depth. Together they
              create a calmer luxury that lets the product lead without losing
              the feeling of the brand.
            </p>
            <div className="feature-story__notes">
              {homeData.brandStory.highlights.map((item) => (
                <div key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>
            <Link to="/shop?category=new-in" className="button button--primary">
              Shop new arrivals
            </Link>
          </div>
          <div className="feature-story__image feature-story__image--framed">
            <img src={leadCollection.image} alt={leadCollection.title} />
          </div>
        </div>
      </section>

      <section className="section landing-showcase">
        <div className="showcase-grid">
          <article className="showcase-feature">
            <div className="showcase-feature__copy">
              <p className="eyebrow">Campaign Select</p>
              <h2>{spotlightProduct.title}</h2>
              <p>
                A sharper shoulder, a softer fall, and the sort of silhouette
                that instantly makes the rest of the look feel settled.
              </p>
              <div className="showcase-feature__meta">
                <span>{spotlightProduct.availableColors.join(" / ")}</span>
                <strong>{formatCurrency(spotlightProduct.price)}</strong>
              </div>
              <Link
                to={`/products/${spotlightProduct.slug}`}
                className="button button--primary"
              >
                View the piece
              </Link>
            </div>
            <div className="showcase-feature__image">
              <img src={spotlightProduct.images[0]} alt={spotlightProduct.title} />
            </div>
          </article>

          <article className="showcase-quote">
            <p className="eyebrow">Style Note</p>
            <h3>Cool enough to stop the scroll, calm enough to feel expensive.</h3>
            <p>
              The landing page now carries a stronger campaign rhythm: bold
              image moments, cleaner white space, and navy depth where it
              matters.
            </p>
          </article>

          {curatedProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="showcase-mini"
            >
              <img src={product.images[0]} alt={product.title} />
              <div>
                <p className="eyebrow">Edit {String(index + 1).padStart(2, "0")}</p>
                <strong>{product.title}</strong>
                <span>{formatCurrency(product.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--split landing-collections">
        <SectionHeading
          eyebrow="Collections"
          title="A cleaner wardrobe rhythm"
          body="Start with the mood you want for the day and move from there: a sharper navy set, a bright white essential, or something softly dressed for evening."
        />
        <div className="category-grid category-grid--navy">
          {homeData.categories.map((category) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className="category-tile"
              style={{
                backgroundImage: `linear-gradient(rgba(16, 16, 20, 0.25), rgba(16, 16, 20, 0.55)), url(${category.image})`
              }}
            >
              <span>{category.name}</span>
              <small>{category.description}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow={`Best Of ${BRAND_NAME}`}
          title="The pieces that make the whole page feel dressed"
          body="Balanced silhouettes, easy movement, and enough structure to make an entrance feel natural."
        />
        <div className="product-grid">
          {homeData.featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section section--stories section--lookbook landing-lookbook">
        <SectionHeading
          eyebrow="Lookbook"
          title="Three ways to wear the mood"
          body="A polished daytime line, a stronger evening silhouette, and an easy set for everything in between."
        />
        <div className="story-grid">
          {homeData.collections.map((collection) => (
            <article key={collection.title} className="story-panel">
              <img src={collection.image} alt={collection.title} />
              <div>
                <p className="eyebrow">Look {String(homeData.collections.indexOf(collection) + 1).padStart(2, "0")}</p>
                <h3>{collection.title}</h3>
                <p>{collection.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--band section--atelier landing-band">
        {homeData.brandStory.highlights.map((item) => (
          <article key={item.title} className="band-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="In Her Words"
          title="Quietly elegant and easy to come back to"
        />
        <div className="testimonial-grid">
          {homeData.testimonials.map((testimonial) => (
            <article key={testimonial.author} className="testimonial">
              <p>&quot;{testimonial.quote}&quot;</p>
              <strong>{testimonial.author}</strong>
              <span>{testimonial.city}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
