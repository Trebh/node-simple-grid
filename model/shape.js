'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shape = new Schema({
  name: String,
  vectors: [{
    type: Schema.Types.ObjectId,
    ref: 'Vector'
  }],
  _ofGrid: {
    type: Schema.Types.ObjectId,
    ref: 'Grid'
  }
});

var Shape = mongoose.model('Shape', shape);

module.exports = {
  model: Shape,
  schema: shape
};