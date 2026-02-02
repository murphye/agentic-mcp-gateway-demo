/* eslint-disable no-unused-vars */
const Service = require('./Service');
const storeData = require('../data/storeData');

/**
 * Get event details
 */
const getEvent = ({ eventId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.getEvent(eventId);

      if (!result) {
        return reject(Service.rejectResponse(`Event not found: ${eventId}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * List store events
 */
const listEvents = ({ storeId, category, topic, startDate, endDate, page, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.listEvents({
        storeId,
        category,
        topic,
        startDate,
        endDate,
        page,
        limit
      });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Register for event
 */
const registerForEvent = ({ eventId, eventRegistrationRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { attendees, specialRequirements } = eventRegistrationRequest || {};
      const result = storeData.registerForEvent(eventId, { attendees, specialRequirements });

      if (!result) {
        return reject(Service.rejectResponse(`Event not found: ${eventId}`, 404));
      }

      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  getEvent,
  listEvents,
  registerForEvent,
};
