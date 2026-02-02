/**
 * The WishlistController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/WishlistService');
const addToWishlist = async (request, response) => {
  await Controller.handleRequest(request, response, service.addToWishlist);
};

const createWishlist = async (request, response) => {
  await Controller.handleRequest(request, response, service.createWishlist);
};

const deleteWishlist = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteWishlist);
};

const getWishlist = async (request, response) => {
  await Controller.handleRequest(request, response, service.getWishlist);
};

const getWishlists = async (request, response) => {
  await Controller.handleRequest(request, response, service.getWishlists);
};


module.exports = {
  addToWishlist,
  createWishlist,
  deleteWishlist,
  getWishlist,
  getWishlists,
};
