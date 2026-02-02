/**
 * The TransactionsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/TransactionsService');
const captureTransaction = async (request, response) => {
  await Controller.handleRequest(request, response, service.captureTransaction);
};

const createTransaction = async (request, response) => {
  await Controller.handleRequest(request, response, service.createTransaction);
};

const getTransaction = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTransaction);
};

const verifyPaymentMethod = async (request, response) => {
  await Controller.handleRequest(request, response, service.verifyPaymentMethod);
};

const voidTransaction = async (request, response) => {
  await Controller.handleRequest(request, response, service.voidTransaction);
};


module.exports = {
  captureTransaction,
  createTransaction,
  getTransaction,
  verifyPaymentMethod,
  voidTransaction,
};
