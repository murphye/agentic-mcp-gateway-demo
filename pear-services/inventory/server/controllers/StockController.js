/**
 * The StockController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/StockService');
const adjustStock = async (request, response) => {
  await Controller.handleRequest(request, response, service.adjustStock);
};

const cancelReservation = async (request, response) => {
  await Controller.handleRequest(request, response, service.cancelReservation);
};

const getStockAtLocation = async (request, response) => {
  await Controller.handleRequest(request, response, service.getStockAtLocation);
};

const getStockBySku = async (request, response) => {
  await Controller.handleRequest(request, response, service.getStockBySku);
};

const getStockLevels = async (request, response) => {
  await Controller.handleRequest(request, response, service.getStockLevels);
};

const reserveStock = async (request, response) => {
  await Controller.handleRequest(request, response, service.reserveStock);
};

const updateStock = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateStock);
};


module.exports = {
  adjustStock,
  cancelReservation,
  getStockAtLocation,
  getStockBySku,
  getStockLevels,
  reserveStock,
  updateStock,
};
