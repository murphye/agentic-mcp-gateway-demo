/* eslint-disable no-unused-vars */
const Service = require('./Service');
const storeData = require('../data/storeData');

/**
 * Add item to wishlist
 */
const addToWishlist = ({ wishlistId, wishlistItemRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { productId, variantId, notes, priority } = wishlistItemRequest;
      const wishlist = storeData.addToWishlist(wishlistId, productId, variantId, notes, priority);

      if (!wishlist) {
        return reject(Service.rejectResponse(`Wishlist not found: ${wishlistId}`, 404));
      }

      resolve(Service.successResponse(wishlist));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Create wishlist
 */
const createWishlist = ({ wishlistRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { name, isPublic } = wishlistRequest || {};
      const wishlist = storeData.createWishlist('default', name, isPublic);
      resolve(Service.successResponse(wishlist, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Delete wishlist
 */
const deleteWishlist = ({ wishlistId }) => new Promise(
  async (resolve, reject) => {
    try {
      const deleted = storeData.deleteWishlist(wishlistId);

      if (!deleted) {
        return reject(Service.rejectResponse(`Wishlist not found: ${wishlistId}`, 404));
      }

      resolve(Service.successResponse({ code: 204 }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get wishlist
 */
const getWishlist = ({ wishlistId }) => new Promise(
  async (resolve, reject) => {
    try {
      const wishlist = storeData.getWishlist(wishlistId);

      if (!wishlist) {
        return reject(Service.rejectResponse(`Wishlist not found: ${wishlistId}`, 404));
      }

      resolve(Service.successResponse(wishlist));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get user wishlists
 */
const getWishlists = () => new Promise(
  async (resolve, reject) => {
    try {
      const wishlists = storeData.getWishlists('default');
      resolve(Service.successResponse({ wishlists }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  addToWishlist,
  createWishlist,
  deleteWishlist,
  getWishlist,
  getWishlists,
};
