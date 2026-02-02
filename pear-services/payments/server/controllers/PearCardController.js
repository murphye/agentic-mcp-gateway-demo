/**
 * The PearCardController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/PearCardService');
const getPearCard = async (request, response) => {
  await Controller.handleRequest(request, response, service.getPearCard);
};

const getPearCardInstallments = async (request, response) => {
  await Controller.handleRequest(request, response, service.getPearCardInstallments);
};

const getPearCardRewards = async (request, response) => {
  await Controller.handleRequest(request, response, service.getPearCardRewards);
};

const linkPearCard = async (request, response) => {
  await Controller.handleRequest(request, response, service.linkPearCard);
};


module.exports = {
  getPearCard,
  getPearCardInstallments,
  getPearCardRewards,
  linkPearCard,
};
