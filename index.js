'use strict';

var create = require('./api/create');
var update = require('./api/update');
var mongoose = require('mongoose');
var config = require('./config/config');
var remove = require('./api/delete');

mongoose.createConnection(config.MONGODB_URL);

module.exports = {
	createNewGrid: create.createNewGrid,
	removeGrid: remove.removeGrid,
	updateVector: update.updateVector
};