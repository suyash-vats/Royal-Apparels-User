import { Link } from "react-router-dom";
import { BRAND_NAME } from "../utils";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid section">
        <div>
          <h3>{BRAND_NAME}</h3>
          <p>
            Dresses with presence, tailoring with ease, and the sort of pieces
            that keep getting invited out again.
          </p>
        </div>
        <div>
          <h4>Wardrobe</h4>
          <Link to="/shop">New arrivals</Link>
          <Link to="/shop?category=work-edit">Tailoring</Link>
          <Link to="/shop?category=occasion">Evening edit</Link>
        </div>
        <div>
          <h4>House</h4>
          <span>hello@royalapparels.com</span>
          <span>Mon-Sat, 10 AM - 7 PM</span>
          <span>Mumbai, India</span>
        </div>
        <div>
          <h4>Notes</h4>
          <span>Express dispatch</span>
          <span>Easy exchanges</span>
          <span>Size help on request</span>
        </div>
      </div>
    </footer>
  );
}
