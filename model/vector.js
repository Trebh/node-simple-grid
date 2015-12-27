'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var grid = require('./grid').schema;

var vector = new Schema({
  row: Number,
  column: Number,
  content: {},
  _ofGrid: { type: Schema.Types.ObjectId, ref: 'grid' }
});


var Vector = mongoose.model('Vector', vector);

module.exports = {
	model: Vector,
	schema: vector
};