// Shared constants & pure helpers used across the whole app

export const BRAND_NAME = "Royal Apparels";
export const INTRO_STORAGE_KEY = "royal_apparels_intro_seen_v2";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export const formatCurrency = (value) => money.format(value || 0);

export const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

export const getUnique = (items) => [...new Set(items.filter(Boolean))];

export const defaultCatalogFilters = {
  search: "",
  category: "",
  sort: "newest",
  featured: ""
};

export const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" }
];

export const emptyProductDraft = {
  title: "",
  slug: "",
  subtitle: "",
  description: "",
  category: "new-in",
  price: "",
  compareAtPrice: "",
  fabric: "",
  fit: "",
  care: "",
  featured: false,
  newArrival: false,
  badgesText: "",
  tagsText: "",
  imagesText: "",
  variantsText: ""
};
