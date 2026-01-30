/**
 * The AddressesController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/AddressesService');
const createAddress = async (request, response) => {
  await Controller.handleRequest(request, response, service.createAddress);
};

const deleteAddress = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteAddress);
};

const getAddress = async (request, response) => {
  await Controller.handleRequest(request, response, service.getAddress);
};

const listAddresses = async (request, response) => {
  await Controller.handleRequest(request, response, service.listAddresses);
};

const setDefaultAddress = async (request, response) => {
  await Controller.handleRequest(request, response, service.setDefaultAddress);
};

const updateAddress = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateAddress);
};


module.exports = {
  createAddress,
  deleteAddress,
  getAddress,
  listAddresses,
  setDefaultAddress,
  updateAddress,
};
