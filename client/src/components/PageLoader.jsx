import { BRAND_NAME } from "../utils";

export default function PageLoader({ label }) {
  return (
    <section className="section">
      <div className="page-loader">
        <div className="page-loader__spinner" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="page-loader__copy">
          <strong>{BRAND_NAME}</strong>
          <p>{label}</p>
        </div>
      </div>
    </section>
  );
}
