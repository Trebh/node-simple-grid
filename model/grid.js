'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var vector = require('./vector').schema;
var shape = require('./shape').schema;

var grid = new Schema({
  rows: Number,
  columns: Number,
  vectors: [{
    type: Schema.Types.ObjectId,
    ref: 'vector'
  }],
  shapes: [{
    type: Schema.Types.ObjectId,
    ref: 'shape'
  }]
});

var Grid = mongoose.model('Grid', grid);

module.exports = {
  model: Grid,
  schema: grid
};