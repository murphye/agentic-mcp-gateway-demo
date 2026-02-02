/**
 * The CartController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/CartService');
const addToCart = async (request, response) => {
  await Controller.handleRequest(request, response, service.addToCart);
};

const addTradeIn = async (request, response) => {
  await Controller.handleRequest(request, response, service.addTradeIn);
};

const applyPromoCode = async (request, response) => {
  await Controller.handleRequest(request, response, service.applyPromoCode);
};

const clearCart = async (request, response) => {
  await Controller.handleRequest(request, response, service.clearCart);
};

const getCart = async (request, response) => {
  await Controller.handleRequest(request, response, service.getCart);
};

const removeCartItem = async (request, response) => {
  await Controller.handleRequest(request, response, service.removeCartItem);
};

const removePromoCode = async (request, response) => {
  await Controller.handleRequest(request, response, service.removePromoCode);
};

const updateCartItem = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateCartItem);
};


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
