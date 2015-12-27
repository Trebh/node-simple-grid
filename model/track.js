'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var grid = require('./grid').schema;
var vector = require('./vector').schema;

var track = new Schema({
  name: String,
  _ofGrid: {
    type: Schema.Types.ObjectId,
    ref: 'grid'
  },
  shapes: {
    type: Schema.Types.ObjectId,
    ref: 'shape'
  }
});

var Track = mongoose.model('Track', track);

module.exports = {
  model: Track,
  schema: track
};