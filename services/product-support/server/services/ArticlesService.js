/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

/**
* Get article by ID
*/
const getArticle = ({ article_id, locale, include_related }) => new Promise(
  async (resolve, reject) => {
    try {
      const article = supportData.getArticle(article_id);
      if (!article) {
        return reject(Service.rejectResponse('Article not found', 404));
      }
      resolve(Service.successResponse(article));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* List support articles
*/
const listArticles = ({ product_id, category, topic, device_type, locale, page, limit, sort }) => new Promise(
  async (resolve, reject) => {
    try {
      const offset = page ? (page - 1) * (limit || 20) : 0;
      const result = supportData.listArticles({
        category,
        deviceType: device_type,
        topic,
        limit: limit || 20,
        offset
      });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Submit article feedback
*/
const submitArticleFeedback = ({ article_id, articleFeedback }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.submitArticleFeedback(article_id, articleFeedback);
      if (!result) {
        return reject(Service.rejectResponse('Article not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  getArticle,
  listArticles,
  submitArticleFeedback,
};
