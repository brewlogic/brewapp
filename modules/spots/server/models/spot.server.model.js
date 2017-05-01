'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Spot Schema
 */
var SpotSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Spot name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  location: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  isLegit: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Spot', SpotSchema);
