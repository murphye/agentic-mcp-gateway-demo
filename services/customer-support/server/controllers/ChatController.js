/**
 * The ChatController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ChatService');
const endChatSession = async (request, response) => {
  await Controller.handleRequest(request, response, service.endChatSession);
};

const getChatAvailability = async (request, response) => {
  await Controller.handleRequest(request, response, service.getChatAvailability);
};

const getChatMessages = async (request, response) => {
  await Controller.handleRequest(request, response, service.getChatMessages);
};

const getChatSession = async (request, response) => {
  await Controller.handleRequest(request, response, service.getChatSession);
};

const sendChatMessage = async (request, response) => {
  await Controller.handleRequest(request, response, service.sendChatMessage);
};

const startChatSession = async (request, response) => {
  await Controller.handleRequest(request, response, service.startChatSession);
};


module.exports = {
  endChatSession,
  getChatAvailability,
  getChatMessages,
  getChatSession,
  sendChatMessage,
  startChatSession,
};
