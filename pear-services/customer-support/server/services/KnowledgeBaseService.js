/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

const getArticle = ({ articleId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getArticle(articleId);
      if (!result) {
        return reject(Service.rejectResponse('Article not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getFeaturedArticles = ({ product }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getFeaturedArticles(product);
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const listCategories = () => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.listCategories();
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const markArticleHelpful = ({ articleId, helpfulRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.markArticleHelpful(
        articleId,
        helpfulRequest?.helpful,
        helpfulRequest?.comments
      );
      if (!result) {
        return reject(Service.rejectResponse('Article not found', 404));
      }
      resolve(Service.successResponse(null, 200));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const searchArticles = ({ query, category, product, language, page, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.searchArticles({ query, category, product, language, page, limit });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getArticle,
  getFeaturedArticles,
  listCategories,
  markArticleHelpful,
  searchArticles,
};
