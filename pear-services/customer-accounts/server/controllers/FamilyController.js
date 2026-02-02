/**
 * The FamilyController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/FamilyService');
const acceptFamilyInvitation = async (request, response) => {
  await Controller.handleRequest(request, response, service.acceptFamilyInvitation);
};

const cancelFamilyInvitation = async (request, response) => {
  await Controller.handleRequest(request, response, service.cancelFamilyInvitation);
};

const createFamilyGroup = async (request, response) => {
  await Controller.handleRequest(request, response, service.createFamilyGroup);
};

const declineFamilyInvitation = async (request, response) => {
  await Controller.handleRequest(request, response, service.declineFamilyInvitation);
};

const getFamilyGroup = async (request, response) => {
  await Controller.handleRequest(request, response, service.getFamilyGroup);
};

const inviteToFamily = async (request, response) => {
  await Controller.handleRequest(request, response, service.inviteToFamily);
};

const leaveFamilyGroup = async (request, response) => {
  await Controller.handleRequest(request, response, service.leaveFamilyGroup);
};

const listFamilyInvitations = async (request, response) => {
  await Controller.handleRequest(request, response, service.listFamilyInvitations);
};

const removeFamilyMember = async (request, response) => {
  await Controller.handleRequest(request, response, service.removeFamilyMember);
};


module.exports = {
  acceptFamilyInvitation,
  cancelFamilyInvitation,
  createFamilyGroup,
  declineFamilyInvitation,
  getFamilyGroup,
  inviteToFamily,
  leaveFamilyGroup,
  listFamilyInvitations,
  removeFamilyMember,
};
