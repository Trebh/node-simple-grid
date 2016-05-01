'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var element = new Schema({
  name: String,
  order: Number,
  vectors: [{
    type: Schema.Types.ObjectId,
    ref: 'Vector'
  }],
  _ofGrid: {
    type: Schema.Types.ObjectId,
    ref: 'Grid'
  },
  width: Number,
  origin: {
    type: Schema.Types.ObjectId,
    ref: 'Vector'
  },
  direction: {
    type: Schema.Types.ObjectId,
    ref: 'Vector'
  }
});

var Element = mongoose.model('Element', element);

module.exports = {
  model: Element,
  schema: element
};