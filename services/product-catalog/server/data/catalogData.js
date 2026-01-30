/**
 * Catalog Data Module
 * Loads and provides access to the product catalog data from catalog.json
 */

const fs = require('fs');
const path = require('path');

// Load catalog data from JSON file
const catalogPath = path.join(__dirname, '../../data/catalog.json');
const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

/**
 * Get all products from the catalog
 */
function getAllProducts() {
  return catalogData.products;
}

/**
 * Get a product by ID
 */
function getProductById(productId) {
  return catalogData.products.find(p => p.id === productId);
}

/**
 * Get all categories
 */
function getAllCategories() {
  return catalogData.categories;
}

/**
 * Get a category by ID
 */
function getCategoryById(categoryId) {
  return catalogData.categories.find(c => c.id === categoryId) || null;
}

/**
 * Get products by category ID
 */
function getProductsByCategoryId(categoryId) {
  return catalogData.products.filter(p => p.categoryId === categoryId);
}

/**
 * Get all promotions
 */
function getAllPromotions() {
  return catalogData.promotions || [];
}

/**
 * Get active promotions for a product
 */
function getPromotionsForProduct(productId) {
  const product = getProductById(productId);
  if (!product) return [];

  const now = new Date();
  return (catalogData.promotions || []).filter(promo => {
    if (!promo.active) return false;

    const validFrom = new Date(promo.validFrom);
    const validTo = new Date(promo.validTo);
    if (now < validFrom || now > validTo) return false;

    // Check if product matches promotion conditions
    if (promo.conditions?.productCategories) {
      const category = catalogData.categories.find(c => c.id === product.categoryId);
      if (!category) return false;

      const matches = promo.conditions.productCategories.some(pc =>
        category.id.includes(pc.replace('cat-', '')) ||
        pc.includes(category.id.replace('cat-', ''))
      );
      if (!matches) return false;
    }

    return true;
  });
}

/**
 * Get trade-in values
 */
function getTradeInValues() {
  return catalogData.tradeInValues || {};
}

/**
 * Get catalog metadata
 */
function getMetadata() {
  return catalogData.metadata;
}

/**
 * Search products by name or description
 */
function searchProducts(query) {
  if (!query) return getAllProducts();

  const lowerQuery = query.toLowerCase();
  return catalogData.products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
    (p.shortDescription && p.shortDescription.toLowerCase().includes(lowerQuery)) ||
    (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
}

/**
 * Filter products by status
 */
function filterProductsByStatus(products, status) {
  if (!status) return products;
  return products.filter(p => p.status === status);
}

/**
 * Filter products by category
 * Accepts API enum values (pearphone, pearbook, etc.) or category slugs
 */
function filterProductsByCategory(products, categoryValue) {
  if (!categoryValue) return products;

  // Map API enum values to category ID prefixes
  const enumToCategoryPrefix = {
    'pearphone': 'cat-phones',
    'pearbook': 'cat-laptops',
    'pearpad': 'cat-tablets',
    'pearwatch': 'cat-watches',
    'pearpods': 'cat-audio',
    'peartv': 'cat-tv',
    'accessories': 'cat-acc',
    'software': 'cat-software'
  };

  // Find matching category IDs
  const matchingCategoryIds = new Set();

  // Check if it's an API enum value
  const categoryPrefix = enumToCategoryPrefix[categoryValue];
  if (categoryPrefix) {
    // Match the main category and all subcategories
    for (const category of catalogData.categories) {
      if (category.id === categoryPrefix || category.id.startsWith(categoryPrefix + '-') || category.parentId === categoryPrefix) {
        matchingCategoryIds.add(category.id);
      }
    }
    // Also add desktop categories for pearbook (they map to pearbook in the API)
    if (categoryValue === 'pearbook') {
      for (const category of catalogData.categories) {
        if (category.id.startsWith('cat-desktops')) {
          matchingCategoryIds.add(category.id);
        }
      }
    }
  } else {
    // Fall back to slug matching
    for (const category of catalogData.categories) {
      const catSlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '');
      if (catSlug === categoryValue || category.id.includes(categoryValue)) {
        matchingCategoryIds.add(category.id);
      }
    }
  }

  return products.filter(p => matchingCategoryIds.has(p.categoryId));
}

module.exports = {
  getAllProducts,
  getProductById,
  getAllCategories,
  getCategoryById,
  getProductsByCategoryId,
  getAllPromotions,
  getPromotionsForProduct,
  getTradeInValues,
  getMetadata,
  searchProducts,
  filterProductsByStatus,
  filterProductsByCategory,
};
