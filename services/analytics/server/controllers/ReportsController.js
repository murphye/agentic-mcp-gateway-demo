/**
 * The ReportsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ReportsService');
const createReport = async (request, response) => {
  await Controller.handleRequest(request, response, service.createReport);
};

const deleteReport = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteReport);
};

const downloadReport = async (request, response) => {
  await Controller.handleRequest(request, response, service.downloadReport);
};

const executeQuery = async (request, response) => {
  await Controller.handleRequest(request, response, service.executeQuery);
};

const getReport = async (request, response) => {
  await Controller.handleRequest(request, response, service.getReport);
};

const listReports = async (request, response) => {
  await Controller.handleRequest(request, response, service.listReports);
};

const runReport = async (request, response) => {
  await Controller.handleRequest(request, response, service.runReport);
};


module.exports = {
  createReport,
  deleteReport,
  downloadReport,
  executeQuery,
  getReport,
  listReports,
  runReport,
};
