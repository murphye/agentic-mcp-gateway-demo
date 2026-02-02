/**
 * The ShipmentsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ShipmentsService');
const cancelPickup = async (request, response) => {
  await Controller.handleRequest(request, response, service.cancelPickup);
};

const cancelShipment = async (request, response) => {
  await Controller.handleRequest(request, response, service.cancelShipment);
};

const createShipment = async (request, response) => {
  await Controller.handleRequest(request, response, service.createShipment);
};

const getShipment = async (request, response) => {
  await Controller.handleRequest(request, response, service.getShipment);
};

const listShipments = async (request, response) => {
  await Controller.handleRequest(request, response, service.listShipments);
};

const schedulePickup = async (request, response) => {
  await Controller.handleRequest(request, response, service.schedulePickup);
};

const updateShipment = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateShipment);
};


module.exports = {
  cancelPickup,
  cancelShipment,
  createShipment,
  getShipment,
  listShipments,
  schedulePickup,
  updateShipment,
};
