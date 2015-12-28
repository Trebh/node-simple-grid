'use strict';

var create = require('./api/create');
var put = require('./api/put');
var get = require('./api/get');
var update = require('./api/update');
var mongoose = require('mongoose');
var config = require('./config/config');
var remove = require('./api/delete');

mongoose.connect(config.MONGODB_URL);

module.exports = {
	createNewGrid: create.createNewGrid,
	createShape: create.createShape,
	removeGrid: remove.removeGrid,
	removeShape: remove.removeShape,
	putObj: put.putObj,
	getVector: get.getVector,
	moveObj: update.moveObj
};