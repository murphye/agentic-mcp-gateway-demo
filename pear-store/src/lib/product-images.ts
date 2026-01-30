// Product image mappings
// Maps product categories to local images in /public

export interface ProductImages {
  primary: string;
  gallery?: string[];
}

// Category-based default images
const categoryImages: Record<string, ProductImages> = {
  pearphone: {
    primary: "/pphone-front.png",
    gallery: ["/pphone-front.png", "/pphone-back.png"],
  },
  pearbook: {
    primary: "/pearbook-front.png",
    gallery: ["/pearbook-front.png", "/pearbook-back.png"],
  },
};

// Fallback emoji by category
const categoryEmoji: Record<string, string> = {
  pearphone: "📱",
  pearbook: "💻",
  pearpad: "📱",
  pearwatch: "⌚",
  pearpods: "🎧",
  peartv: "📺",
  accessories: "🔌",
  software: "💿",
};

export function getProductImage(category?: string): string | null {
  if (!category) return null;
  return categoryImages[category]?.primary || null;
}

export function getProductGallery(category?: string): string[] {
  if (!category) return [];
  return categoryImages[category]?.gallery || [];
}

export function getProductEmoji(category?: string): string {
  if (!category) return "🍐";
  return categoryEmoji[category] || "🍐";
}

export function hasProductImage(category?: string): boolean {
  return !!category && !!categoryImages[category];
}
