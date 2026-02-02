/* eslint-disable no-unused-vars */
const Service = require('./Service');
const customerData = require('../data/customerData');

const getFamilyGroup = ({ userId }) => new Promise(
  async (resolve, reject) => {
    try {
      const targetUserId = userId || customerData.getCurrentUser();
      const result = customerData.getFamilyGroup(targetUserId);
      if (!result) {
        return reject(Service.rejectResponse('Not part of a family group', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const createFamilyGroup = ({ familyRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.createFamilyGroup(customerData.getCurrentUser(), familyRequest || {});
      if (result?.error) {
        return reject(Service.rejectResponse(result.message, 400));
      }
      if (!result) {
        return reject(Service.rejectResponse('User not found', 404));
      }
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const leaveFamilyGroup = () => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.leaveFamilyGroup(customerData.getCurrentUser());
      if (result?.error) {
        return reject(Service.rejectResponse(result.message, 400));
      }
      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const listFamilyInvitations = () => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.listFamilyInvitations(customerData.getCurrentUser());
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const inviteToFamily = ({ inviteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.inviteToFamily(customerData.getCurrentUser(), inviteRequest || {});
      if (result?.error) {
        return reject(Service.rejectResponse(result.message, 400));
      }
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const cancelFamilyInvitation = ({ invitationId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.cancelFamilyInvitation(invitationId);
      if (!result) {
        return reject(Service.rejectResponse('Invitation not found', 404));
      }
      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const acceptFamilyInvitation = ({ invitationId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.acceptFamilyInvitation(customerData.getCurrentUser(), invitationId);
      if (result?.error) {
        return reject(Service.rejectResponse(result.message, 400));
      }
      if (!result) {
        return reject(Service.rejectResponse('Invitation not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const declineFamilyInvitation = ({ invitationId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.declineFamilyInvitation(invitationId);
      if (!result) {
        return reject(Service.rejectResponse('Invitation not found', 404));
      }
      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const removeFamilyMember = ({ memberId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.removeFamilyMember(customerData.getCurrentUser(), memberId);
      if (result?.error) {
        return reject(Service.rejectResponse(result.message, 400));
      }
      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getFamilyGroup,
  createFamilyGroup,
  leaveFamilyGroup,
  listFamilyInvitations,
  inviteToFamily,
  cancelFamilyInvitation,
  acceptFamilyInvitation,
  declineFamilyInvitation,
  removeFamilyMember,
};
