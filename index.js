'use strict';

var create = require('./api/create');
var put = require('./api/put');
var get = require('./api/get');
var mongoose = require('mongoose');
var config = require('./config/config');
var remove = require('./api/delete');

mongoose.connect(config.MONGODB_URL);

module.exports = {
	createNewGrid: create.createNewGrid,
	removeGrid: remove.removeGrid,
	putObj: put.putObj,
	getVector: get.getVector
};