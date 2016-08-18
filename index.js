'use strict';

var create = require('./api/create');
var put = require('./api/put');
var get = require('./api/get');
var update = require('./api/update');
var mongoose = require('mongoose');
var remove = require('./api/delete');
var findConfig = require('find-config');
var tracks = require('./tracks/tracks').tracks;

var configFile = findConfig('simple-grid-config.js', {
  dir: 'config'
}) || findConfig('simple-grid-config.example.js', {
  dir: 'config'
});
var config = require(configFile);

mongoose.connect(config.MONGODB_URL);

module.exports = {
  createNewGrid: create.createNewGrid,
  createShape: create.createShape,
  createTrack: create.createTrack,
  removeGrid: remove.removeGrid,
  removeShape: remove.removeShape,
  removeTrack: remove.removeTrack,
  putObj: put.putObj,
  getVector: get.getVector,
  moveObj: update.moveObj,
  findAndPopulate: get.findAndPopulate,
  findDocById: get.findDocById,
  searchDoc: get.searchDoc,
  tracks: tracks
};