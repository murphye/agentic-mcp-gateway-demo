/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

const addTicketMessage = ({ ticketId, messageRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.addTicketMessage(
        ticketId,
        supportData.getCurrentUser(),
        messageRequest?.message
      );
      if (!result) {
        return reject(Service.rejectResponse('Ticket not found', 404));
      }
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const closeTicket = ({ ticketId, closeRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.closeTicket(
        ticketId,
        closeRequest?.resolution,
        closeRequest?.feedback
      );
      if (!result) {
        return reject(Service.rejectResponse('Ticket not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const createTicket = ({ createTicketRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.createTicket(
        supportData.getCurrentUser(),
        createTicketRequest
      );
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getTicket = ({ ticketId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getTicket(ticketId);
      if (!result) {
        return reject(Service.rejectResponse('Ticket not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getTicketMessages = ({ ticketId, page, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const ticket = supportData.getTicket(ticketId);
      if (!ticket) {
        return reject(Service.rejectResponse('Ticket not found', 404));
      }
      const result = supportData.getTicketMessages(ticketId, { page, limit });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const listTickets = ({ status, priority, page, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.listTickets(
        supportData.getCurrentUser(),
        { status, priority, page, limit }
      );
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const reopenTicket = ({ ticketId, reopenRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.reopenTicket(ticketId, reopenRequest?.reason);
      if (!result) {
        return reject(Service.rejectResponse('Ticket not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const updateTicket = ({ ticketId, ticketUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.updateTicket(ticketId, ticketUpdate);
      if (!result) {
        return reject(Service.rejectResponse('Ticket not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

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
