/**
 * The DevicesController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/DevicesService');
const disableLostMode = async (request, response) => {
  await Controller.handleRequest(request, response, service.disableLostMode);
};

const enableLostMode = async (request, response) => {
  await Controller.handleRequest(request, response, service.enableLostMode);
};

const getDevice = async (request, response) => {
  await Controller.handleRequest(request, response, service.getDevice);
};

const listDevices = async (request, response) => {
  await Controller.handleRequest(request, response, service.listDevices);
};

const locateDevice = async (request, response) => {
  await Controller.handleRequest(request, response, service.locateDevice);
};

const playDeviceSound = async (request, response) => {
  await Controller.handleRequest(request, response, service.playDeviceSound);
};

const removeDevice = async (request, response) => {
  await Controller.handleRequest(request, response, service.removeDevice);
};

const updateDevice = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateDevice);
};


module.exports = {
  disableLostMode,
  enableLostMode,
  getDevice,
  listDevices,
  locateDevice,
  playDeviceSound,
  removeDevice,
  updateDevice,
};
