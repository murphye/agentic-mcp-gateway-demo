/* eslint-disable no-unused-vars */
const Service = require('./Service');
const catalogData = require('../data/catalogData');

/**
 * Helper to map catalog category to API response format
 */
function mapCategoryToResponse(category, includeProductCount = true) {
  const result = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || null,
    parentId: category.parentId || null,
  };

  if (includeProductCount) {
    result.productCount = catalogData.getProductsByCategoryId(category.id).length;
  }

  return result;
}

/**
 * Helper to map product to response format (shared with ProductsService)
 */
function mapProductToResponse(product) {
  const mapCategoryIdToEnum = (categoryId) => {
    const mapping = {
      'cat-phones': 'pearphone',
      'cat-phones-pro': 'pearphone',
      'cat-phones-standard': 'pearphone',
      'cat-phones-se': 'pearphone',
      'cat-laptops': 'pearbook',
      'cat-laptops-pro': 'pearbook',
      'cat-laptops-air': 'pearbook',
      'cat-tablets': 'pearpad',
      'cat-tablets-pro': 'pearpad',
      'cat-tablets-air': 'pearpad',
      'cat-tablets-mini': 'pearpad',
      'cat-watches': 'pearwatch',
      'cat-watches-ultra': 'pearwatch',
      'cat-watches-series': 'pearwatch',
      'cat-watches-se': 'pearwatch',
      'cat-audio': 'pearpods',
      'cat-audio-pods-pro': 'pearpods',
      'cat-audio-pods': 'pearpods',
      'cat-audio-max': 'pearpods',
      'cat-tv': 'peartv',
      'cat-desktops': 'pearbook',
      'cat-desktops-studio': 'pearbook',
      'cat-desktops-mini': 'pearbook',
      'cat-desktops-imac': 'pearbook',
      'cat-accessories': 'accessories',
      'cat-acc-cases': 'accessories',
      'cat-acc-charging': 'accessories',
      'cat-acc-input': 'accessories',
      'cat-acc-displays': 'accessories'
    };
    return mapping[categoryId] || 'accessories';
  };

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: mapCategoryIdToEnum(product.categoryId),
    status: product.status,
    releaseDate: product.releaseDate,
    images: product.images ? [
      { url: product.images.hero, alt: product.name, type: 'hero' },
      { url: product.images.thumbnail, alt: `${product.name} thumbnail`, type: 'thumbnail' },
      ...(product.images.gallery || []).map((url, i) => ({
        url,
        alt: `${product.name} gallery ${i + 1}`,
        type: 'gallery'
      }))
    ].filter(img => img.url) : [],
    basePrice: {
      amount: product.basePrice,
      currency: 'USD'
    },
    variants: (product.variants || []).map(v => ({
      id: v.id,
      sku: v.sku,
      attributes: v.attributes,
      price: {
        amount: v.price,
        currency: 'USD'
      },
      available: v.inStock !== false
    })),
    specifications: product.specifications,
    tags: product.tags || [],
    createdAt: product.releaseDate ? new Date(product.releaseDate).toISOString() : null,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Get products by category
 * Retrieve all products in a specific category
 *
 * categoryId String
 * page Integer Page number for pagination (optional)
 * limit Integer Number of items per page (optional)
 * returns ProductListResponse
 */
const getProductsByCategory = ({ categoryId, page = 1, limit = 20 }) => new Promise(
  async (resolve, reject) => {
    try {
      const category = catalogData.getCategoryById(categoryId);

      if (!category) {
        return reject(Service.rejectResponse(
          `Category not found: ${categoryId}`,
          404
        ));
      }

      const products = catalogData.getProductsByCategoryId(categoryId);

      // Calculate pagination
      const totalItems = products.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedProducts = products.slice(startIndex, endIndex);

      resolve(Service.successResponse({
        products: paginatedProducts.map(mapProductToResponse),
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1
        }
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * List product categories
 * Retrieve all product categories
 *
 * returns CategoryListResponse
 */
const listCategories = () => new Promise(
  async (resolve, reject) => {
    try {
      const categories = catalogData.getAllCategories();

      resolve(Service.successResponse({
        categories: categories.map(c => mapCategoryToResponse(c))
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

module.exports = {
  getProductsByCategory,
  listCategories,
};
