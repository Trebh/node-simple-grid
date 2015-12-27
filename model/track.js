'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var grid = require('./grid').schema;
var vector = require('./vector').schema;
var element = require('./element').schema;

var track = new Schema({
  name: String,
  _ofGrid: {
    type: Schema.Types.ObjectId,
    ref: 'grid'
  },
  elements: {
    type: Schema.Types.ObjectId,
    ref: 'element'
  }
});

var Track = mongoose.model('Track', track);

module.exports = {
  model: Track,
  schema: track
};