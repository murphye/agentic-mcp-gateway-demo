/**
 * Data access module for online store
 * Provides in-memory data stores for carts, wishlists, reviews, etc.
 */

// In-memory stores
const carts = new Map();
const wishlists = new Map();
const reviews = new Map();
const checkoutSessions = new Map();

// Sample product data for mock responses
const sampleProducts = [
  {
    productId: 'PEAR-PPH-1601',
    name: 'pPhone 16 Pro Max',
    image: 'https://cdn.pearcomputer.com/products/pphone-16-pro-max/hero.jpg',
    price: { amount: 1199, currency: 'USD' },
    rating: 4.8,
    reviewCount: 2543
  },
  {
    productId: 'PEAR-PPH-1602',
    name: 'pPhone 16 Pro',
    image: 'https://cdn.pearcomputer.com/products/pphone-16-pro/hero.jpg',
    price: { amount: 999, currency: 'USD' },
    rating: 4.7,
    reviewCount: 1823
  },
  {
    productId: 'PEAR-PBK-1501',
    name: 'pBook Pro 16"',
    image: 'https://cdn.pearcomputer.com/products/pbook-pro-16/hero.jpg',
    price: { amount: 2499, currency: 'USD' },
    rating: 4.9,
    reviewCount: 892
  },
  {
    productId: 'PEAR-PPD-1001',
    name: 'pPad Pro 13"',
    image: 'https://cdn.pearcomputer.com/products/ppad-pro-13/hero.jpg',
    price: { amount: 1299, currency: 'USD' },
    rating: 4.8,
    reviewCount: 1456
  },
  {
    productId: 'PEAR-PWH-1001',
    name: 'pWatch Ultra 2',
    image: 'https://cdn.pearcomputer.com/products/pwatch-ultra-2/hero.jpg',
    price: { amount: 799, currency: 'USD' },
    rating: 4.6,
    reviewCount: 678
  },
  {
    productId: 'PEAR-PPP-0301',
    name: 'pPods Pro 2',
    image: 'https://cdn.pearcomputer.com/products/ppods-pro-2/hero.jpg',
    price: { amount: 249, currency: 'USD' },
    rating: 4.5,
    reviewCount: 3421
  }
];

// Valid promo codes
const promoCodes = {
  'SAVE10': { discount: 10, type: 'percentage', description: '10% off your order' },
  'SAVE50': { discount: 50, type: 'fixed', description: '$50 off orders over $500' },
  'NEWCUSTOMER': { discount: 15, type: 'percentage', description: '15% off for new customers' },
  'FREESHIP': { discount: 0, type: 'free_shipping', description: 'Free shipping on your order' }
};

// Shipping options
const shippingOptions = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivered in 5-7 business days',
    carrier: 'USPS',
    price: { amount: 0, currency: 'USD' },
    estimatedDelivery: { minDays: 5, maxDays: 7 }
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivered in 2-3 business days',
    carrier: 'FedEx',
    price: { amount: 14.99, currency: 'USD' },
    estimatedDelivery: { minDays: 2, maxDays: 3 }
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Delivered next business day',
    carrier: 'FedEx',
    price: { amount: 29.99, currency: 'USD' },
    estimatedDelivery: { minDays: 1, maxDays: 1 }
  }
];

// Sample reviews for products
const sampleReviews = {
  'PEAR-PPH-1601': [
    {
      id: 'rev-001',
      productId: 'PEAR-PPH-1601',
      author: { id: 'user-123', displayName: 'John D.', verifiedPurchase: true },
      rating: 5,
      title: 'Best phone I have ever owned!',
      body: 'The camera quality is absolutely incredible. The new Action button is super useful for quick shortcuts.',
      pros: ['Amazing camera', 'Great battery life', 'Fast performance'],
      cons: ['Expensive'],
      images: [],
      helpfulCount: 142,
      createdAt: '2024-10-15T10:30:00Z',
      response: null
    },
    {
      id: 'rev-002',
      productId: 'PEAR-PPH-1601',
      author: { id: 'user-456', displayName: 'Sarah M.', verifiedPurchase: true },
      rating: 4,
      title: 'Great upgrade from my old phone',
      body: 'Love the titanium design and the display is gorgeous. Wish it had longer battery life though.',
      pros: ['Beautiful display', 'Lightweight design', 'Fast charging'],
      cons: ['Battery could be better', 'Gets warm during gaming'],
      images: [],
      helpfulCount: 87,
      createdAt: '2024-10-20T14:15:00Z',
      response: null
    }
  ]
};

// Helper functions
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getProductById(productId) {
  return sampleProducts.find(p => p.productId === productId);
}

function calculateCartTotals(cart) {
  let subtotal = 0;
  cart.items.forEach(item => {
    subtotal += item.unitPrice.amount * item.quantity;
  });

  let discount = 0;
  if (cart.promoCode) {
    const promo = promoCodes[cart.promoCode.code];
    if (promo) {
      if (promo.type === 'percentage') {
        discount = subtotal * (promo.discount / 100);
      } else if (promo.type === 'fixed') {
        discount = promo.discount;
      }
    }
  }

  const taxRate = 0.0875; // 8.75% tax
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax - (cart.tradeIn ? cart.tradeIn.estimatedValue.amount : 0);

  cart.subtotal = { amount: subtotal, currency: 'USD' };
  cart.discount = { amount: discount, currency: 'USD' };
  cart.tax = { amount: Math.round(tax * 100) / 100, currency: 'USD' };
  cart.total = { amount: Math.round(Math.max(0, total) * 100) / 100, currency: 'USD' };
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.updatedAt = new Date().toISOString();

  return cart;
}

// Cart functions
function getOrCreateCart(cartId = 'default') {
  if (!carts.has(cartId)) {
    const cart = {
      id: cartId,
      customerId: null,
      items: [],
      subtotal: { amount: 0, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tax: { amount: 0, currency: 'USD' },
      total: { amount: 0, currency: 'USD' },
      promoCode: null,
      tradeIn: null,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    carts.set(cartId, cart);
  }
  return carts.get(cartId);
}

function addItemToCart(cartId, productId, variantId, quantity, options) {
  const cart = getOrCreateCart(cartId);
  const product = getProductById(productId);

  if (!product) return null;

  const existingItem = cart.items.find(item =>
    item.productId === productId && item.variantId === variantId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.totalPrice.amount = existingItem.unitPrice.amount * existingItem.quantity;
  } else {
    const newItem = {
      id: generateId('item'),
      productId,
      variantId: variantId || `${productId}-default`,
      sku: `SKU-${productId}`,
      name: product.name,
      image: product.image,
      options: options || { color: 'Natural Titanium', storage: '256GB' },
      quantity,
      unitPrice: product.price,
      totalPrice: { amount: product.price.amount * quantity, currency: 'USD' },
      available: true,
      maxQuantity: 10
    };
    cart.items.push(newItem);
  }

  return calculateCartTotals(cart);
}

function updateCartItem(cartId, itemId, quantity, options) {
  const cart = getOrCreateCart(cartId);
  const item = cart.items.find(i => i.id === itemId);

  if (!item) return null;

  if (quantity !== undefined) {
    item.quantity = quantity;
    item.totalPrice.amount = item.unitPrice.amount * quantity;
  }

  if (options) {
    item.options = { ...item.options, ...options };
  }

  return calculateCartTotals(cart);
}

function removeCartItem(cartId, itemId) {
  const cart = getOrCreateCart(cartId);
  const index = cart.items.findIndex(i => i.id === itemId);

  if (index === -1) return null;

  cart.items.splice(index, 1);
  return calculateCartTotals(cart);
}

function clearCart(cartId) {
  const cart = getOrCreateCart(cartId);
  cart.items = [];
  cart.promoCode = null;
  cart.tradeIn = null;
  return calculateCartTotals(cart);
}

function applyPromoCode(cartId, code) {
  const cart = getOrCreateCart(cartId);
  const promo = promoCodes[code.toUpperCase()];

  if (!promo) {
    return { error: 'invalid', message: 'Invalid promo code' };
  }

  cart.promoCode = {
    code: code.toUpperCase(),
    description: promo.description,
    discount: { amount: 0, currency: 'USD' }
  };

  calculateCartTotals(cart);
  cart.promoCode.discount = cart.discount;

  return cart;
}

function removePromoCode(cartId) {
  const cart = getOrCreateCart(cartId);
  cart.promoCode = null;
  return calculateCartTotals(cart);
}

function addTradeIn(cartId, deviceType, model, storageSize, condition) {
  const cart = getOrCreateCart(cartId);

  // Calculate trade-in value based on device and condition
  const baseValues = {
    pearphone: { excellent: 600, good: 450, fair: 300, poor: 150 },
    pearpad: { excellent: 500, good: 375, fair: 250, poor: 125 },
    pearbook: { excellent: 800, good: 600, fair: 400, poor: 200 },
    pearwatch: { excellent: 200, good: 150, fair: 100, poor: 50 }
  };

  const baseValue = baseValues[deviceType]?.[condition] || 100;

  const tradeIn = {
    id: generateId('trade'),
    deviceType,
    model,
    condition,
    estimatedValue: { amount: baseValue, currency: 'USD' },
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  };

  cart.tradeIn = tradeIn;
  calculateCartTotals(cart);

  return tradeIn;
}

// Checkout functions
function createCheckoutSession(cartId, shippingAddressId, billingAddressId) {
  const cart = getOrCreateCart(cartId);

  const session = {
    id: generateId('checkout'),
    status: 'active',
    cart: { ...cart },
    shippingAddress: {
      id: shippingAddressId || 'addr-default',
      firstName: 'John',
      lastName: 'Doe',
      street1: '1 Infinite Loop',
      city: 'Cupertino',
      state: 'CA',
      postalCode: '95014',
      country: 'US',
      phone: '+1-408-555-1234'
    },
    billingAddress: null,
    shippingOption: null,
    paymentMethod: null,
    pricing: {
      subtotal: cart.subtotal,
      shipping: { amount: 0, currency: 'USD' },
      tax: cart.tax,
      discount: cart.discount,
      tradeInCredit: cart.tradeIn ? cart.tradeIn.estimatedValue : { amount: 0, currency: 'USD' },
      total: cart.total
    },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  };

  checkoutSessions.set(session.id, session);
  return session;
}

function getCheckoutSession(sessionId) {
  return checkoutSessions.get(sessionId);
}

function setShippingOption(sessionId, shippingOptionId) {
  const session = checkoutSessions.get(sessionId);
  if (!session) return null;

  const option = shippingOptions.find(o => o.id === shippingOptionId);
  if (!option) return null;

  session.shippingOption = { ...option };

  // Add delivery date
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + option.estimatedDelivery.maxDays);
  session.shippingOption.estimatedDelivery.date = deliveryDate.toISOString().split('T')[0];

  // Update pricing
  session.pricing.shipping = option.price;
  const total = session.pricing.subtotal.amount +
    session.pricing.shipping.amount +
    session.pricing.tax.amount -
    session.pricing.discount.amount -
    session.pricing.tradeInCredit.amount;
  session.pricing.total = { amount: Math.round(Math.max(0, total) * 100) / 100, currency: 'USD' };

  return session;
}

function setPaymentMethod(sessionId, type, cardToken, last4, brand) {
  const session = checkoutSessions.get(sessionId);
  if (!session) return null;

  session.paymentMethod = {
    type,
    last4: last4 || '4242',
    brand: brand || 'Visa',
    expiryMonth: 12,
    expiryYear: 2027
  };

  return session;
}

function placeOrder(sessionId) {
  const session = checkoutSessions.get(sessionId);
  if (!session) return null;

  session.status = 'completed';

  const orderNumber = `PEAR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (session.shippingOption?.estimatedDelivery?.maxDays || 5));

  return {
    orderId: generateId('order'),
    orderNumber,
    status: 'confirmed',
    estimatedDelivery: deliveryDate.toISOString().split('T')[0],
    items: session.cart.items,
    total: session.pricing.total,
    paymentMethod: session.paymentMethod,
    shippingAddress: session.shippingAddress,
    trackingUrl: `https://pearcomputer.com/orders/${orderNumber}/track`,
    receiptUrl: `https://pearcomputer.com/orders/${orderNumber}/receipt`
  };
}

// Wishlist functions
function getWishlists(userId = 'default') {
  const userWishlists = [];
  wishlists.forEach((wishlist, id) => {
    if (wishlist.userId === userId) {
      userWishlists.push(wishlist);
    }
  });
  return userWishlists;
}

function createWishlist(userId, name, isPublic) {
  const wishlist = {
    id: generateId('wishlist'),
    userId,
    name,
    isPublic: isPublic || false,
    shareUrl: isPublic ? `https://pearcomputer.com/wishlists/${generateId('share')}` : null,
    items: [],
    itemCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  wishlists.set(wishlist.id, wishlist);
  return wishlist;
}

function getWishlist(wishlistId) {
  return wishlists.get(wishlistId);
}

function deleteWishlist(wishlistId) {
  return wishlists.delete(wishlistId);
}

function addToWishlist(wishlistId, productId, variantId, notes) {
  const wishlist = wishlists.get(wishlistId);
  if (!wishlist) return null;

  const product = getProductById(productId);
  if (!product) return null;

  const item = {
    id: generateId('witem'),
    productId,
    variantId,
    name: product.name,
    image: product.image,
    price: product.price,
    available: true,
    notes,
    addedAt: new Date().toISOString()
  };

  wishlist.items.push(item);
  wishlist.itemCount = wishlist.items.length;
  wishlist.updatedAt = new Date().toISOString();

  return wishlist;
}

// Review functions
function getProductReviews(productId) {
  return sampleReviews[productId] || [];
}

function createReview(productId, userId, rating, title, body, pros, cons) {
  const review = {
    id: generateId('rev'),
    productId,
    author: { id: userId, displayName: 'Customer', verifiedPurchase: true },
    rating,
    title,
    body,
    pros: pros || [],
    cons: cons || [],
    images: [],
    helpfulCount: 0,
    createdAt: new Date().toISOString(),
    response: null
  };

  if (!sampleReviews[productId]) {
    sampleReviews[productId] = [];
  }
  sampleReviews[productId].push(review);

  return review;
}

// Recommendations
function getRecommendations(type, limit) {
  const shuffled = [...sampleProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit).map(p => ({
    ...p,
    reason: type === 'trending' ? 'Popular right now' :
            type === 'new_arrivals' ? 'Just released' :
            type === 'based_on_cart' ? 'Complements your cart' :
            'Recommended for you'
  }));
}

function getRelatedProducts(productId, type, limit) {
  const product = getProductById(productId);
  if (!product) return [];

  const related = sampleProducts
    .filter(p => p.productId !== productId)
    .slice(0, limit)
    .map(p => ({
      ...p,
      reason: type === 'accessories' ? 'Works great with your ' + product.name :
              type === 'frequently_bought_together' ? 'Customers also bought' :
              'Similar to ' + product.name
    }));

  return related;
}

module.exports = {
  getOrCreateCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyPromoCode,
  removePromoCode,
  addTradeIn,
  createCheckoutSession,
  getCheckoutSession,
  setShippingOption,
  setPaymentMethod,
  placeOrder,
  getWishlists,
  createWishlist,
  getWishlist,
  deleteWishlist,
  addToWishlist,
  getProductReviews,
  createReview,
  getRecommendations,
  getRelatedProducts,
  shippingOptions,
  sampleProducts
};
