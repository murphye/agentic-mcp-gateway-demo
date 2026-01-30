/* eslint-disable no-unused-vars */
const Service = require('./Service');
const storeData = require('../data/storeData');

/**
 * Add item to cart
 */
const addToCart = ({ cartItemRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { productId, variantId, quantity, options } = cartItemRequest;
      const cart = storeData.addItemToCart('default', productId, variantId, quantity, options);

      if (!cart) {
        return reject(Service.rejectResponse('Product not found', 404));
      }

      resolve(Service.successResponse(cart));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Add trade-in device
 */
const addTradeIn = ({ tradeInRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { deviceType, model, storageSize, condition } = tradeInRequest;
      const tradeIn = storeData.addTradeIn('default', deviceType, model, storageSize, condition);
      resolve(Service.successResponse(tradeIn));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Apply promo code
 */
const applyPromoCode = ({ promoCodeRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { code } = promoCodeRequest;
      const result = storeData.applyPromoCode('default', code);

      if (result.error) {
        return reject(Service.rejectResponse({
          code: 'INVALID_PROMO_CODE',
          message: result.message,
          reason: result.error
        }, 400));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Clear shopping cart
 */
const clearCart = () => new Promise(
  async (resolve, reject) => {
    try {
      storeData.clearCart('default');
      resolve(Service.successResponse({ code: 204 }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get shopping cart
 */
const getCart = () => new Promise(
  async (resolve, reject) => {
    try {
      const cart = storeData.getOrCreateCart('default');
      resolve(Service.successResponse(cart));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Remove item from cart
 */
const removeCartItem = ({ itemId }) => new Promise(
  async (resolve, reject) => {
    try {
      const cart = storeData.removeCartItem('default', itemId);

      if (!cart) {
        return reject(Service.rejectResponse(`Item not found: ${itemId}`, 404));
      }

      resolve(Service.successResponse(cart));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Remove promo code
 */
const removePromoCode = () => new Promise(
  async (resolve, reject) => {
    try {
      const cart = storeData.removePromoCode('default');
      resolve(Service.successResponse(cart));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Update cart item
 */
const updateCartItem = ({ itemId, cartItemUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const { quantity, options } = cartItemUpdate;
      const cart = storeData.updateCartItem('default', itemId, quantity, options);

      if (!cart) {
        return reject(Service.rejectResponse(`Item not found: ${itemId}`, 404));
      }

      resolve(Service.successResponse(cart));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  addToCart,
  addTradeIn,
  applyPromoCode,
  clearCart,
  getCart,
  removeCartItem,
  removePromoCode,
  updateCartItem,
};
