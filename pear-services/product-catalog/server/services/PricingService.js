/* eslint-disable no-unused-vars */
const Service = require('./Service');
const catalogData = require('../data/catalogData');

/**
 * Get product pricing
 * Retrieve pricing information including regional prices and promotions
 *
 * productId String Unique product identifier
 * region String Region code for localized pricing (optional)
 * returns ProductPricing
 */
const getProductPricing = ({ productId, region = 'US' }) => new Promise(
  async (resolve, reject) => {
    try {
      const product = catalogData.getProductById(productId);

      if (!product) {
        return reject(Service.rejectResponse(
          `Product not found: ${productId}`,
          404
        ));
      }

      // Get active promotions for this product
      const promotions = catalogData.getPromotionsForProduct(productId);

      // Map promotions to API format
      const mappedPromotions = promotions.map(p => ({
        id: p.id,
        name: p.name,
        discountType: p.type === 'bundle' ? 'bundle' : (p.reward?.type === 'credit' ? 'fixed' : 'percentage'),
        discountValue: p.reward?.maxValue || 0,
        validFrom: p.validFrom,
        validTo: p.validTo,
        conditions: p.description
      }));

      // Build variant pricing
      const variantPricing = (product.variants || []).map(v => ({
        variantId: v.id,
        sku: v.sku,
        price: {
          amount: v.price,
          currency: 'USD'
        }
      }));

      // Build financing options (Pear Card at 0% APR)
      const financingOptions = [];
      if (product.basePrice >= 99) {
        const terms = [6, 12, 24];
        for (const term of terms) {
          if (product.basePrice >= term * 10) { // Minimum monthly payment threshold
            financingOptions.push({
              provider: 'Pear Card',
              term,
              monthlyPayment: {
                amount: Math.ceil((product.basePrice / term) * 100) / 100,
                currency: 'USD'
              },
              apr: 0.0
            });
          }
        }
      }

      // Calculate trade-in value if applicable
      let tradeInValue = null;
      const tradeInValues = catalogData.getTradeInValues();

      // Check product category for trade-in eligibility
      if (product.categoryId.includes('phone') && tradeInValues.pphone) {
        const maxTradeIn = tradeInValues.pphone[0];
        if (maxTradeIn) {
          tradeInValue = {
            amount: maxTradeIn.maxValue,
            currency: 'USD'
          };
        }
      } else if (product.categoryId.includes('laptop') && tradeInValues.pearbook) {
        const maxTradeIn = tradeInValues.pearbook[0];
        if (maxTradeIn) {
          tradeInValue = {
            amount: maxTradeIn.maxValue,
            currency: 'USD'
          };
        }
      }

      resolve(Service.successResponse({
        productId: product.id,
        basePrice: {
          amount: product.basePrice,
          currency: 'USD'
        },
        variants: variantPricing,
        promotions: mappedPromotions,
        tradeInValue,
        financingOptions
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

module.exports = {
  getProductPricing,
};
