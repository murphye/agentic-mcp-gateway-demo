/* eslint-disable no-unused-vars */
const Service = require('./Service');
const inventoryData = require('../data/inventoryData');

/**
 * Create inventory transfer
 * Initiate a transfer between locations
 *
 * transferRequest TransferRequest
 * returns Transfer
 */
const createTransfer = ({ transferRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { fromLocationId, toLocationId, items, priority, notes, requestedDeliveryDate } = transferRequest;

      const transfer = inventoryData.createTransfer(
        fromLocationId,
        toLocationId,
        items,
        priority,
        notes,
        requestedDeliveryDate
      );

      if (!transfer) {
        return reject(Service.rejectResponse(
          'Invalid source or destination location',
          400
        ));
      }

      resolve(Service.successResponse(transfer, 201));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * Get transfer details
 * Retrieve details of a specific transfer
 *
 * transferId String
 * returns Transfer
 */
const getTransfer = ({ transferId }) => new Promise(
  async (resolve, reject) => {
    try {
      const transfer = inventoryData.getTransferById(transferId);

      if (!transfer) {
        return reject(Service.rejectResponse(
          `Transfer not found: ${transferId}`,
          404
        ));
      }

      resolve(Service.successResponse(transfer));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * List inventory transfers
 * Retrieve inventory transfer orders
 *
 * status String  (optional)
 * fromLocationId String  (optional)
 * toLocationId String  (optional)
 * page Integer  (optional)
 * limit Integer  (optional)
 * returns TransferListResponse
 */
const listTransfers = ({ status, fromLocationId, toLocationId, page = 1, limit = 50 }) => new Promise(
  async (resolve, reject) => {
    try {
      let transfers = inventoryData.getTransfers();

      // Apply filters
      if (status) {
        transfers = transfers.filter(t => t.status === status);
      }

      if (fromLocationId) {
        transfers = transfers.filter(t => t.fromLocationId === fromLocationId);
      }

      if (toLocationId) {
        transfers = transfers.filter(t => t.toLocationId === toLocationId);
      }

      // Pagination
      const totalItems = transfers.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const paginatedItems = transfers.slice(startIndex, startIndex + limit);

      resolve(Service.successResponse({
        transfers: paginatedItems,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages
        }
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * Update transfer status
 * Update the status of an inventory transfer
 *
 * transferId String
 * transferStatusUpdate TransferStatusUpdate
 * returns Transfer
 */
const updateTransferStatus = ({ transferId, transferStatusUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const { status, notes } = transferStatusUpdate;

      const transfer = inventoryData.updateTransferStatus(transferId, status, notes);

      if (!transfer) {
        return reject(Service.rejectResponse(
          `Transfer not found: ${transferId}`,
          404
        ));
      }

      resolve(Service.successResponse(transfer));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

module.exports = {
  createTransfer,
  getTransfer,
  listTransfers,
  updateTransferStatus,
};
