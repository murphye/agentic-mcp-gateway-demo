/**
 * The OrdersController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/OrdersService');
const cancelOrder = async (request, response) => {
  await Controller.handleRequest(request, response, service.cancelOrder);
};

const cancelOrderItem = async (request, response) => {
  await Controller.handleRequest(request, response, service.cancelOrderItem);
};

const createOrder = async (request, response) => {
  await Controller.handleRequest(request, response, service.createOrder);
};

const getGiftReceipt = async (request, response) => {
  await Controller.handleRequest(request, response, service.getGiftReceipt);
};

const getOrder = async (request, response) => {
  await Controller.handleRequest(request, response, service.getOrder);
};

const getOrdersByCustomer = async (request, response) => {
  await Controller.handleRequest(request, response, service.getOrdersByCustomer);
};

const getOrderReceipt = async (request, response) => {
  await Controller.handleRequest(request, response, service.getOrderReceipt);
};

const getOrderTracking = async (request, response) => {
  await Controller.handleRequest(request, response, service.getOrderTracking);
};

const listOrders = async (request, response) => {
  await Controller.handleRequest(request, response, service.listOrders);
};

const lookupOrder = async (request, response) => {
  await Controller.handleRequest(request, response, service.lookupOrder);
};


module.exports = {
  cancelOrder,
  cancelOrderItem,
  createOrder,
  getGiftReceipt,
  getOrder,
  getOrdersByCustomer,
  getOrderReceipt,
  getOrderTracking,
  listOrders,
  lookupOrder,
};
