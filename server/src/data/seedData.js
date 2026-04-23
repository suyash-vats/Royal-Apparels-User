export const brandStory = {
  name: "Veloura",
  tagline: "Tailored for the days you want softness and certainty together.",
  mission:
    "Veloura designs statement-ready essentials for women who move between work, dinners, flights, celebrations, and slow Sundays without changing their sense of self.",
  heroImage:
    "https://images.pexels.com/photos/977587/pexels-photo-977587.jpeg?auto=compress&cs=tinysrgb&w=1600",
  highlights: [
    {
      title: "Same-day dispatch",
      description: "Orders placed before 2 PM ship the same day from our studio."
    },
    {
      title: "Fit-first tailoring",
      description: "Every silhouette is graded for movement, layering, and easy styling."
    },
    {
      title: "Returns that feel human",
      description: "Easy exchanges and guided returns for eligible orders."
    }
  ],
  metrics: [
    { label: "Design drops", value: "24" },
    { label: "Happy customers", value: "8.4k" },
    { label: "Repeat purchase rate", value: "63%" }
  ]
};

export const categories = [
  {
    slug: "new-in",
    name: "New In",
    description: "Fresh arrivals with sharp tailoring, soft drape, and polished details.",
    image:
      "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1200",
    accent: "#d9485f"
  },
  {
    slug: "work-edit",
    name: "Work Edit",
    description: "Modern power pieces that move from desk to dinner with ease.",
    image:
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200",
    accent: "#0e8a74"
  },
  {
    slug: "occasion",
    name: "Occasion",
    description: "Elevated dresses and co-ords that feel celebratory without trying too hard.",
    image:
      "https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1200",
    accent: "#f5c84b"
  },
  {
    slug: "essentials",
    name: "Essentials",
    description: "Everyday layers, strong basics, and pieces that style in seconds.",
    image:
      "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1200",
    accent: "#4b5563"
  }
];

export const homeCollections = [
  {
    title: "The Soft Structure Edit",
    subtitle: "Pleated dresses, shaped blazers, and fluid sets for a sharper everyday look.",
    image:
      "https://images.pexels.com/photos/6765029/pexels-photo-6765029.jpeg?auto=compress&cs=tinysrgb&w=1400"
  },
  {
    title: "Weekend Glow",
    subtitle: "Light fabrics, warm shades, and easy silhouettes for slower plans.",
    image:
      "https://images.pexels.com/photos/6311398/pexels-photo-6311398.jpeg?auto=compress&cs=tinysrgb&w=1400"
  },
  {
    title: "After-hours Tailoring",
    subtitle: "Looks with enough drama for rooftop dinners and intimate celebrations.",
    image:
      "https://images.pexels.com/photos/4947740/pexels-photo-4947740.jpeg?auto=compress&cs=tinysrgb&w=1400"
  }
];

export const testimonials = [
  {
    quote:
      "The fit feels premium, and the fabric falls beautifully even after a long day.",
    author: "Aarohi K.",
    city: "Mumbai"
  },
  {
    quote:
      "I bought one set for a work event and ended up wearing each piece three different ways.",
    author: "Meera S.",
    city: "Bengaluru"
  },
  {
    quote:
      "Clean silhouettes, flattering cuts, and the checkout flow was genuinely easy.",
    author: "Naina R.",
    city: "Delhi"
  }
];

export const products = [
  {
    id: "veloura-midnight-wrap",
    title: "Midnight Wrap Dress",
    slug: "midnight-wrap-dress",
    subtitle: "Bias-cut satin with an elegant side tie and fluid movement.",
    description:
      "A softly draped wrap dress designed for dinner plans, receptions, and nights when you want your silhouette to do the talking.",
    category: "occasion",
    price: 4890,
    compareAtPrice: 5490,
    rating: 4.8,
    reviewCount: 124,
    badges: ["Best Seller", "Limited Restock"],
    images: [
      "https://images.pexels.com/photos/6311580/pexels-photo-6311580.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6311593/pexels-photo-6311593.jpeg?auto=compress&cs=tinysrgb&w=1400"
    ],
    fabric: "Satin weave with soft lining",
    fit: "Skims the waist with a fluid skirt",
    care: "Dry clean preferred",
    tags: ["occasion", "dress", "satin"],
    featured: true,
    newArrival: true,
    variants: [
      { sku: "MWD-BLK-XS", color: "Onyx", size: "XS", stock: 6 },
      { sku: "MWD-BLK-S", color: "Onyx", size: "S", stock: 10 },
      { sku: "MWD-BLK-M", color: "Onyx", size: "M", stock: 11 },
      { sku: "MWD-BLK-L", color: "Onyx", size: "L", stock: 7 },
      { sku: "MWD-BRG-S", color: "Berry", size: "S", stock: 5 },
      { sku: "MWD-BRG-M", color: "Berry", size: "M", stock: 8 }
    ]
  },
  {
    id: "veloura-sage-structured-blazer",
    title: "Sage Structured Blazer",
    slug: "sage-structured-blazer",
    subtitle: "Sharp lapels, cinched shape, and a softened shoulder line.",
    description:
      "A confidence piece for presentation days and late reservations, cut in a structured stretch fabric that still feels easy to wear.",
    category: "work-edit",
    price: 5290,
    compareAtPrice: 5990,
    rating: 4.9,
    reviewCount: 88,
    badges: ["Editor Pick"],
    images: [
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6311398/pexels-photo-6311398.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1400"
    ],
    fabric: "Stretch suiting blend",
    fit: "Tailored through the waist with an elongated line",
    care: "Cool iron, dry clean when needed",
    tags: ["blazer", "work", "tailoring"],
    featured: true,
    newArrival: false,
    variants: [
      { sku: "SSB-SGE-S", color: "Sage", size: "S", stock: 9 },
      { sku: "SSB-SGE-M", color: "Sage", size: "M", stock: 12 },
      { sku: "SSB-SGE-L", color: "Sage", size: "L", stock: 5 },
      { sku: "SSB-CRM-S", color: "Pearl", size: "S", stock: 6 },
      { sku: "SSB-CRM-M", color: "Pearl", size: "M", stock: 8 }
    ]
  },
  {
    id: "veloura-rosewide-leg",
    title: "Rosewide Tailored Trousers",
    slug: "rosewide-tailored-trousers",
    subtitle: "A full-length wide leg with a clean front and soft drape.",
    description:
      "Cut to partner with blazers, knit tops, and cropped shirts, these trousers bring movement to every polished outfit.",
    category: "work-edit",
    price: 3590,
    compareAtPrice: 3990,
    rating: 4.7,
    reviewCount: 64,
    badges: ["Wardrobe Staple"],
    images: [
      "https://images.pexels.com/photos/6311659/pexels-photo-6311659.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6765032/pexels-photo-6765032.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1400"
    ],
    fabric: "Fluid suiting crepe",
    fit: "High rise with a soft wide leg",
    care: "Machine wash gentle, hang dry",
    tags: ["trousers", "work", "tailoring"],
    featured: false,
    newArrival: true,
    variants: [
      { sku: "RWT-RSE-XS", color: "Rosewood", size: "XS", stock: 8 },
      { sku: "RWT-RSE-S", color: "Rosewood", size: "S", stock: 10 },
      { sku: "RWT-RSE-M", color: "Rosewood", size: "M", stock: 9 },
      { sku: "RWT-CHC-S", color: "Charcoal", size: "S", stock: 7 },
      { sku: "RWT-CHC-M", color: "Charcoal", size: "M", stock: 11 }
    ]
  },
  {
    id: "veloura-ivory-knit",
    title: "Ivory Rib Knit Top",
    slug: "ivory-rib-knit-top",
    subtitle: "Clean neckline, soft texture, and a polished close fit.",
    description:
      "An elevated essential designed to anchor tailoring, denim, and skirts without losing its shape through the day.",
    category: "essentials",
    price: 1990,
    compareAtPrice: 2390,
    rating: 4.6,
    reviewCount: 143,
    badges: ["Easy Layer"],
    images: [
      "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1400"
    ],
    fabric: "Soft rib knit",
    fit: "Close to the body with stretch",
    care: "Cold wash, flat dry",
    tags: ["knit", "essential", "top"],
    featured: true,
    newArrival: false,
    variants: [
      { sku: "IRK-IVY-XS", color: "Ivory", size: "XS", stock: 15 },
      { sku: "IRK-IVY-S", color: "Ivory", size: "S", stock: 18 },
      { sku: "IRK-IVY-M", color: "Ivory", size: "M", stock: 16 },
      { sku: "IRK-MOC-S", color: "Mocha", size: "S", stock: 9 },
      { sku: "IRK-MOC-M", color: "Mocha", size: "M", stock: 11 }
    ]
  },
  {
    id: "veloura-coral-coord",
    title: "Coral Drape Co-ord Set",
    slug: "coral-drape-coord-set",
    subtitle: "A fluid shirt and matching trousers that style instantly.",
    description:
      "Built for destination dinners, event mornings, and travel wardrobes, this co-ord lands right between comfort and occasion.",
    category: "occasion",
    price: 6290,
    compareAtPrice: 6990,
    rating: 4.9,
    reviewCount: 71,
    badges: ["New Drop"],
    images: [
      "https://images.pexels.com/photos/4947740/pexels-photo-4947740.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6765029/pexels-photo-6765029.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6311398/pexels-photo-6311398.jpeg?auto=compress&cs=tinysrgb&w=1400"
    ],
    fabric: "Lightweight drape crepe",
    fit: "Relaxed shirt and straight leg trouser",
    care: "Gentle hand wash",
    tags: ["co-ord", "occasion", "travel"],
    featured: true,
    newArrival: true,
    variants: [
      { sku: "CDC-CRL-S", color: "Coral", size: "S", stock: 7 },
      { sku: "CDC-CRL-M", color: "Coral", size: "M", stock: 9 },
      { sku: "CDC-CRL-L", color: "Coral", size: "L", stock: 5 },
      { sku: "CDC-OLV-S", color: "Olive", size: "S", stock: 4 },
      { sku: "CDC-OLV-M", color: "Olive", size: "M", stock: 6 }
    ]
  },
  {
    id: "veloura-noir-midi",
    title: "Noir Pleated Midi",
    slug: "noir-pleated-midi",
    subtitle: "Knife pleats, clean waistline, and a quiet statement shape.",
    description:
      "A modern occasion dress with controlled volume, styled to feel elegant from festive lunches to evening reservations.",
    category: "occasion",
    price: 5590,
    compareAtPrice: 6190,
    rating: 4.8,
    reviewCount: 58,
    badges: ["Limited Edition"],
    images: [
      "https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6311580/pexels-photo-6311580.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg?auto=compress&cs=tinysrgb&w=1400"
    ],
    fabric: "Pleated georgette with lining",
    fit: "Defined waist and midi volume",
    care: "Steam only, dry clean preferred",
    tags: ["dress", "occasion", "pleated"],
    featured: false,
    newArrival: false,
    variants: [
      { sku: "NPM-NIR-S", color: "Noir", size: "S", stock: 6 },
      { sku: "NPM-NIR-M", color: "Noir", size: "M", stock: 7 },
      { sku: "NPM-NIR-L", color: "Noir", size: "L", stock: 4 },
      { sku: "NPM-EMR-S", color: "Emerald", size: "S", stock: 3 }
    ]
  },
  {
    id: "veloura-dawn-shirt",
    title: "Dawn Oversized Shirt",
    slug: "dawn-oversized-shirt",
    subtitle: "A polished oversized shirt with a soft dropped shoulder.",
    description:
      "The piece you reach for when denim, tailored trousers, or shorts need something cleaner and more considered.",
    category: "essentials",
    price: 2790,
    compareAtPrice: 3290,
    rating: 4.5,
    reviewCount: 92,
    badges: ["Customer Favorite"],
    images: [
      "https://images.pexels.com/photos/6765032/pexels-photo-6765032.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1400"
    ],
    fabric: "Crisp cotton blend",
    fit: "Relaxed oversized silhouette",
    care: "Machine wash cool",
    tags: ["shirt", "essential", "cotton"],
    featured: false,
    newArrival: true,
    variants: [
      { sku: "DOS-WHT-S", color: "White", size: "S", stock: 12 },
      { sku: "DOS-WHT-M", color: "White", size: "M", stock: 14 },
      { sku: "DOS-BLU-S", color: "Sky", size: "S", stock: 8 },
      { sku: "DOS-BLU-M", color: "Sky", size: "M", stock: 7 }
    ]
  },
  {
    id: "veloura-moss-knit-dress",
    title: "Moss Knit Column Dress",
    slug: "moss-knit-column-dress",
    subtitle: "A clean sleeveless column that layers beautifully under tailoring.",
    description:
      "Minimal enough for everyday wear, elevated enough for after-hours styling with sculptural jewelry and a sharp blazer.",
    category: "new-in",
    price: 4190,
    compareAtPrice: 4690,
    rating: 4.7,
    reviewCount: 39,
    badges: ["Trending"],
    images: [
      "https://images.pexels.com/photos/6311593/pexels-photo-6311593.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6311659/pexels-photo-6311659.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1400"
    ],
    fabric: "Compact rib knit",
    fit: "Skims the body with stretch",
    care: "Cold wash, flat dry",
    tags: ["dress", "knit", "new-in"],
    featured: true,
    newArrival: true,
    variants: [
      { sku: "MKC-MOS-S", color: "Moss", size: "S", stock: 6 },
      { sku: "MKC-MOS-M", color: "Moss", size: "M", stock: 9 },
      { sku: "MKC-NIR-S", color: "Noir", size: "S", stock: 5 },
      { sku: "MKC-NIR-M", color: "Noir", size: "M", stock: 8 }
    ]
  }
];

