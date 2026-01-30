/**
 * The PaymentMethodsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/PaymentMethodsService');
const createPaymentMethod = async (request, response) => {
  await Controller.handleRequest(request, response, service.createPaymentMethod);
};

const deletePaymentMethod = async (request, response) => {
  await Controller.handleRequest(request, response, service.deletePaymentMethod);
};

const getPaymentMethod = async (request, response) => {
  await Controller.handleRequest(request, response, service.getPaymentMethod);
};

const listPaymentMethods = async (request, response) => {
  await Controller.handleRequest(request, response, service.listPaymentMethods);
};

const updatePaymentMethod = async (request, response) => {
  await Controller.handleRequest(request, response, service.updatePaymentMethod);
};


module.exports = {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethod,
  listPaymentMethods,
  updatePaymentMethod,
};
