'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var vector = require('./vector').schema;

var grid = new Schema({
  rows: Number,
  columns: Number,
  vectors:[{ type: Schema.Types.ObjectId, ref: 'vector' }]
});

var Grid = mongoose.model('Grid', grid);

module.exports = {
	model: Grid,
	schema: grid
};