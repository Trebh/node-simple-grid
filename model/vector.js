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

/*vector.methods.getContent = function(){
	return JSON.parse(this.content);
};*/

/*vector.methods.store = function(what){
	this.content = JSON.stringify(what);
};*/

var Vector = mongoose.model('Vector', vector);

module.exports = {
	model: Vector,
	schema: vector
};