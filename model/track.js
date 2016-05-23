'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = require('data.task');
var R = require('ramda');
var utils = require('../utils/utils');

var track = new Schema({
  name: String,
  _ofGrid: {
    type: Schema.Types.ObjectId,
    ref: 'Grid'
  },
  elements: [{
    type: Schema.Types.ObjectId,
    ref: 'Element'
  }]
});

track.methods.isContinous = function() {
  return new Task(function(reject, resolve) {
    this.populate('elements')
      .execPopulate()
      .then(function(thisTrack) {

        if (!thisTrack.elements || thisTrack.elements.legth < 3) {
          reject('invalid elements');
        }

        if (utils.checkElementsConn(thisTrack.elements)) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

var Track = mongoose.model('Track', track);

module.exports = {
  model: Track,
  schema: track
};