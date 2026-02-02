/* eslint-disable no-unused-vars */
const Service = require('./Service');
const storeData = require('../data/storeData');

/**
 * Cancel appointment
 */
const cancelAppointment = ({ appointmentId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.cancelAppointment(appointmentId);

      if (!result) {
        return reject(Service.rejectResponse(`Appointment not found: ${appointmentId}`, 404));
      }

      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Book appointment
 */
const createAppointment = ({ appointmentRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { storeId, type, slotId, deviceType, deviceModel, deviceSerialNumber, issueDescription, notes } = appointmentRequest;
      const result = storeData.createAppointment({
        storeId,
        type,
        slotId,
        deviceType,
        deviceModel,
        deviceSerialNumber,
        issueDescription,
        notes
      });
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get appointment details
 */
const getAppointment = ({ appointmentId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.getAppointment(appointmentId);

      if (!result) {
        return reject(Service.rejectResponse(`Appointment not found: ${appointmentId}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get appointment availability
 */
const getAppointmentAvailability = ({ storeId, serviceType, startDate, endDate, productCategory }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.getAppointmentAvailability({
        storeId,
        serviceType,
        startDate,
        endDate,
        productCategory
      });

      if (!result) {
        return reject(Service.rejectResponse(`Store not found: ${storeId}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * List user appointments
 */
const listAppointments = ({ status, storeId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.listAppointments({ status, storeId });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Update appointment
 */
const updateAppointment = ({ appointmentId, updateAppointmentRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { slotId, notes, deviceSerialNumber } = updateAppointmentRequest;
      const result = storeData.updateAppointment(appointmentId, { slotId, notes, deviceSerialNumber });

      if (!result) {
        return reject(Service.rejectResponse(`Appointment not found: ${appointmentId}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  cancelAppointment,
  createAppointment,
  getAppointment,
  getAppointmentAvailability,
  listAppointments,
  updateAppointment,
};
