'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var grid = require('./grid').schema;
var vector = require('./vector').schema;

var shape = new Schema({
  name: String,
  order: Number,
  vectors: [{
    type: Schema.Types.ObjectId,
    ref: 'vector'
  }],
  _ofGrid: {
    type: Schema.Types.ObjectId,
    ref: 'grid'
  },
  width: Number,
  origin: {
    type: Schema.Types.ObjectId,
    ref: 'vector'
  },
  direction: {
    type: Schema.Types.ObjectId,
    ref: 'vector'
  }
});

var Shape = mongoose.model('Shape', shape);

module.exports = {
  model: Shape,
  schema: shape
};