'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var grid = new Schema({
  rows: Number,
  columns: Number
});

var Grid = mongoose.model('Grid', grid);

module.exports = {
	model: Grid,
	schema: grid
};