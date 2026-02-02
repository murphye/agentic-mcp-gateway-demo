/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

const endChatSession = ({ sessionId, endChatRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.endChatSession(sessionId, endChatRequest?.feedback);
      if (!result) {
        return reject(Service.rejectResponse('Chat session not found', 404));
      }
      resolve(Service.successResponse(null, 200));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getChatAvailability = ({ topic }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getChatAvailability(topic);
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getChatMessages = ({ sessionId, after }) => new Promise(
  async (resolve, reject) => {
    try {
      const session = supportData.getChatSession(sessionId);
      if (!session) {
        return reject(Service.rejectResponse('Chat session not found', 404));
      }
      const result = supportData.getChatMessages(sessionId, after);
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getChatSession = ({ sessionId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getChatSession(sessionId);
      if (!result) {
        return reject(Service.rejectResponse('Chat session not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const sendChatMessage = ({ sessionId, chatMessageRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.sendChatMessage(
        sessionId,
        supportData.getCurrentUser(),
        chatMessageRequest?.message
      );
      if (!result) {
        return reject(Service.rejectResponse('Chat session not found', 404));
      }
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const startChatSession = ({ chatRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.startChatSession(
        supportData.getCurrentUser(),
        chatRequest || {}
      );
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  endChatSession,
  getChatAvailability,
  getChatMessages,
  getChatSession,
  sendChatMessage,
  startChatSession,
};
