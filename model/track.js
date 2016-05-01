'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var track = new Schema({
  name: String,
  _ofGrid: {
    type: Schema.Types.ObjectId,
    ref: 'Grid'
  },
  elements: {
    type: Schema.Types.ObjectId,
    ref: 'Element'
  }
});

var Track = mongoose.model('Track', track);

module.exports = {
  model: Track,
  schema: track
};