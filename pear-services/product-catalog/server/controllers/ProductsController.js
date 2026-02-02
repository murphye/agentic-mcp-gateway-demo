/**
 * The ProductsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ProductsService');
const compareProducts = async (request, response) => {
  await Controller.handleRequest(request, response, service.compareProducts);
};

const getProduct = async (request, response) => {
  await Controller.handleRequest(request, response, service.getProduct);
};

const getProductVariants = async (request, response) => {
  await Controller.handleRequest(request, response, service.getProductVariants);
};

const listProducts = async (request, response) => {
  await Controller.handleRequest(request, response, service.listProducts);
};


module.exports = {
  compareProducts,
  getProduct,
  getProductVariants,
  listProducts,
};
