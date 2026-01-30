/* eslint-disable no-unused-vars */
const Service = require('./Service');
const catalogData = require('../data/catalogData');

/**
 * Helper to map catalog product to API response format
 */
function mapProductToResponse(product) {
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
 * Map category ID to category enum value
 */
function mapCategoryIdToEnum(categoryId) {
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
}

/**
 * Compare products
 * Compare specifications and features across multiple products
 *
 * compareProductsRequest CompareProductsRequest
 * returns ProductComparison
 */
const compareProducts = ({ compareProductsRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { productIds, attributes } = compareProductsRequest;

      if (!productIds || productIds.length < 2) {
        return reject(Service.rejectResponse(
          'At least 2 product IDs are required for comparison',
          400
        ));
      }

      const products = productIds
        .map(id => catalogData.getProductById(id))
        .filter(p => p !== undefined);

      if (products.length < 2) {
        return reject(Service.rejectResponse(
          'Not enough valid products found for comparison',
          404
        ));
      }

      // Build comparison data
      const comparisonProducts = products.map(p => ({
        id: p.id,
        name: p.name
      }));

      // Default attributes to compare if none specified
      const attributesToCompare = attributes || [
        'basePrice',
        'specifications.display.size',
        'specifications.display.resolution',
        'specifications.processor.name',
        'specifications.battery.videoPlayback',
        'status'
      ];

      const comparisonAttributes = attributesToCompare.map(attrPath => {
        const values = {};
        for (const product of products) {
          let value = product;
          for (const key of attrPath.split('.')) {
            value = value?.[key];
          }
          if (attrPath === 'basePrice' && typeof value === 'number') {
            values[product.id] = `$${value.toFixed(2)}`;
          } else {
            values[product.id] = value !== undefined ? String(value) : 'N/A';
          }
        }
        return {
          name: attrPath,
          values
        };
      });

      resolve(Service.successResponse({
        products: comparisonProducts,
        attributes: comparisonAttributes
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
 * Get product details
 * Retrieve detailed information about a specific product
 *
 * productId String Unique product identifier
 * include List Additional data to include (optional)
 * returns Product
 */
const getProduct = ({ productId, include }) => new Promise(
  async (resolve, reject) => {
    try {
      const product = catalogData.getProductById(productId);

      if (!product) {
        return reject(Service.rejectResponse(
          `Product not found: ${productId}`,
          404
        ));
      }

      const response = mapProductToResponse(product);

      // Handle optional includes
      if (include && Array.isArray(include)) {
        if (!include.includes('specifications')) {
          delete response.specifications;
        }
        if (!include.includes('variants')) {
          delete response.variants;
        }
        // pricing and reviews would be handled separately if needed
      }

      resolve(Service.successResponse(response));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * Get product variants
 * Retrieve all variants (colors, storage sizes, etc.) for a product
 *
 * productId String Unique product identifier
 * returns ProductVariantsResponse
 */
const getProductVariants = ({ productId }) => new Promise(
  async (resolve, reject) => {
    try {
      const product = catalogData.getProductById(productId);

      if (!product) {
        return reject(Service.rejectResponse(
          `Product not found: ${productId}`,
          404
        ));
      }

      const variants = (product.variants || []).map(v => ({
        id: v.id,
        sku: v.sku,
        attributes: v.attributes,
        price: {
          amount: v.price,
          currency: 'USD'
        },
        available: v.inStock !== false
      }));

      resolve(Service.successResponse({
        productId: product.id,
        variants
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
 * List all products
 * Retrieve a paginated list of all Pear Computer products
 *
 * page Integer Page number for pagination (optional)
 * limit Integer Number of items per page (optional)
 * category ProductCategory Filter by product category (optional)
 * status String Filter by product status (optional)
 * search String Search products by name or description (optional)
 * returns ProductListResponse
 */
const listProducts = ({ page = 1, limit = 20, category, status, search }) => new Promise(
  async (resolve, reject) => {
    try {
      let products = catalogData.getAllProducts();

      // Apply search filter
      if (search) {
        products = catalogData.searchProducts(search);
      }

      // Apply category filter
      if (category) {
        products = catalogData.filterProductsByCategory(products, category);
      }

      // Apply status filter
      if (status) {
        products = catalogData.filterProductsByStatus(products, status);
      }

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

module.exports = {
  compareProducts,
  getProduct,
  getProductVariants,
  listProducts,
};
