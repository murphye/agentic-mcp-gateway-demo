/* eslint-disable no-unused-vars */
const Service = require('./Service');
const catalogData = require('../data/catalogData');

/**
 * Get product specifications
 * Retrieve detailed technical specifications for a product
 *
 * productId String Unique product identifier
 * returns ProductSpecifications
 */
const getProductSpecifications = ({ productId }) => new Promise(
  async (resolve, reject) => {
    try {
      const product = catalogData.getProductById(productId);

      if (!product) {
        return reject(Service.rejectResponse(
          `Product not found: ${productId}`,
          404
        ));
      }

      const specs = product.specifications || {};

      // Map to API format with proper structure
      const response = {
        display: specs.display ? {
          size: specs.display.size,
          resolution: specs.display.resolution,
          technology: specs.display.technology,
          refreshRate: specs.display.refreshRate
        } : null,
        processor: specs.processor ? {
          name: specs.processor.name,
          cores: specs.processor.cores || specs.processor.cpu,
          gpu: specs.processor.gpu
        } : null,
        camera: specs.camera ? {
          main: specs.camera.main,
          ultrawide: specs.camera.ultrawide,
          telephoto: specs.camera.telephoto
        } : null,
        battery: specs.battery ? {
          capacity: specs.battery.capacity,
          videoPlayback: specs.battery.videoPlayback
        } : null,
        dimensions: specs.dimensions ? {
          height: specs.dimensions.height,
          width: specs.dimensions.width,
          depth: specs.dimensions.depth,
          weight: specs.dimensions.weight
        } : null,
        connectivity: specs.connectivity || [],
        features: specs.features || product.features || []
      };

      // Remove null values
      Object.keys(response).forEach(key => {
        if (response[key] === null) {
          delete response[key];
        }
      });

      resolve(Service.successResponse(response));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

module.exports = {
  getProductSpecifications,
};
