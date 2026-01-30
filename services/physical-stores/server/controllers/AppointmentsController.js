/**
 * The AppointmentsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/AppointmentsService');
const cancelAppointment = async (request, response) => {
  await Controller.handleRequest(request, response, service.cancelAppointment);
};

const createAppointment = async (request, response) => {
  await Controller.handleRequest(request, response, service.createAppointment);
};

const getAppointment = async (request, response) => {
  await Controller.handleRequest(request, response, service.getAppointment);
};

const getAppointmentAvailability = async (request, response) => {
  await Controller.handleRequest(request, response, service.getAppointmentAvailability);
};

const listAppointments = async (request, response) => {
  await Controller.handleRequest(request, response, service.listAppointments);
};

const updateAppointment = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateAppointment);
};


module.exports = {
  cancelAppointment,
  createAppointment,
  getAppointment,
  getAppointmentAvailability,
  listAppointments,
  updateAppointment,
};
