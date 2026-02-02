/**
 * The CheckoutController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/CheckoutService');
const getCheckoutSession = async (request, response) => {
  await Controller.handleRequest(request, response, service.getCheckoutSession);
};

const getShippingOptions = async (request, response) => {
  await Controller.handleRequest(request, response, service.getShippingOptions);
};

const initiateCheckout = async (request, response) => {
  await Controller.handleRequest(request, response, service.initiateCheckout);
};

const placeOrder = async (request, response) => {
  await Controller.handleRequest(request, response, service.placeOrder);
};

const setPaymentMethod = async (request, response) => {
  await Controller.handleRequest(request, response, service.setPaymentMethod);
};

const setShippingOption = async (request, response) => {
  await Controller.handleRequest(request, response, service.setShippingOption);
};


module.exports = {
  getCheckoutSession,
  getShippingOptions,
  initiateCheckout,
  placeOrder,
  setPaymentMethod,
  setShippingOption,
};
