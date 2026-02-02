/**
 * The KnowledgeBaseController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/KnowledgeBaseService');
const getArticle = async (request, response) => {
  await Controller.handleRequest(request, response, service.getArticle);
};

const getFeaturedArticles = async (request, response) => {
  await Controller.handleRequest(request, response, service.getFeaturedArticles);
};

const listCategories = async (request, response) => {
  await Controller.handleRequest(request, response, service.listCategories);
};

const markArticleHelpful = async (request, response) => {
  await Controller.handleRequest(request, response, service.markArticleHelpful);
};

const searchArticles = async (request, response) => {
  await Controller.handleRequest(request, response, service.searchArticles);
};


module.exports = {
  getArticle,
  getFeaturedArticles,
  listCategories,
  markArticleHelpful,
  searchArticles,
};
