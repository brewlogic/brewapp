'use strict';

/**
 * Module dependencies
 */
var spotsPolicy = require('../policies/spots.server.policy'),
  spots = require('../controllers/spots.server.controller');

module.exports = function(app) {
  // Spots Routes
  app.route('/api/spots').all(spotsPolicy.isAllowed)
    .get(spots.list)
    .post(spots.create);

  app.route('/api/spots/:spotId').all(spotsPolicy.isAllowed)
    .get(spots.read)
    .put(spots.update)
    .delete(spots.delete);

  // Finish by binding the Spot middleware
  app.param('spotId', spots.spotByID);
};
