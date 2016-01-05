'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var grid = new Schema({
	name: String,
  rows: Number,
  columns: Number,
  vectors: [{
    type: Schema.Types.ObjectId,
    ref: 'Vector'
  }],
  shapes: [{
    type: Schema.Types.ObjectId,
    ref: 'Shape'
  }],
  track:{
    type: Schema.Types.ObjectId,
    ref: 'Track'
  }
});

var Grid = mongoose.model('Grid', grid);

module.exports = {
  model: Grid,
  schema: grid
};