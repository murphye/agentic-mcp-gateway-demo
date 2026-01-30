/**
 * The TicketsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/TicketsService');
const addTicketMessage = async (request, response) => {
  await Controller.handleRequest(request, response, service.addTicketMessage);
};

const closeTicket = async (request, response) => {
  await Controller.handleRequest(request, response, service.closeTicket);
};

const createTicket = async (request, response) => {
  await Controller.handleRequest(request, response, service.createTicket);
};

const getTicket = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTicket);
};

const getTicketMessages = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTicketMessages);
};

const listTickets = async (request, response) => {
  await Controller.handleRequest(request, response, service.listTickets);
};

const reopenTicket = async (request, response) => {
  await Controller.handleRequest(request, response, service.reopenTicket);
};

const updateTicket = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateTicket);
};


module.exports = {
  addTicketMessage,
  closeTicket,
  createTicket,
  getTicket,
  getTicketMessages,
  listTickets,
  reopenTicket,
  updateTicket,
};
