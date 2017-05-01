'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Spot = mongoose.model('Spot'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Spot
 */
exports.create = function(req, res) {
  var spot = new Spot(req.body);
  spot.user = req.user;

  spot.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spot);
    }
  });
};

/**
 * Show the current Spot
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var spot = req.spot ? req.spot.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  spot.isCurrentUserOwner = req.user && spot.user && spot.user._id.toString() === req.user._id.toString();

  res.jsonp(spot);
};

/**
 * Update a Spot
 */
exports.update = function(req, res) {
  var spot = req.spot;

  spot = _.extend(spot, req.body);

  spot.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spot);
    }
  });
};

/**
 * Delete an Spot
 */
exports.delete = function(req, res) {
  var spot = req.spot;

  spot.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spot);
    }
  });
};

/**
 * List of Spots
 */
exports.list = function(req, res) {
  Spot.find().sort('-created').populate('user', 'displayName').exec(function(err, spots) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spots);
    }
  });
};

/**
 * Spot middleware
 */
exports.spotByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Spot is invalid'
    });
  }

  Spot.findById(id).populate('user', 'displayName').exec(function (err, spot) {
    if (err) {
      return next(err);
    } else if (!spot) {
      return res.status(404).send({
        message: 'No Spot with that identifier has been found'
      });
    }
    req.spot = spot;
    next();
  });
};
