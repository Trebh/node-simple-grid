'use strict';

var create = require('./api/create');
var put = require('./api/put');
var get = require('./api/get');
var update = require('./api/update');
var mongoose = require('mongoose');
var remove = require('./api/delete');
var findConfig = require('find-config');

var configFile = findConfig('simple-grid-config.js', { dir: 'config' });
var config = require(configFile);

mongoose.connect(config.MONGODB_URL);

module.exports = {
	createNewGrid: create.createNewGrid,
	createShape: create.createShape,
	removeGrid: remove.removeGrid,
	removeShape: remove.removeShape,
	putObj: put.putObj,
	getVector: get.getVector,
	moveObj: update.moveObj,
	findAndPopulate: get.findAndPopulate,
	findDocById: get.findDocById
};