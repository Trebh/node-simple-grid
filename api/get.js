/*'use strict';

var mongoose = require('mongoose');
var config = require('../config/config');
var Task = require('data.task');
var Grid = require('../model/grid').model;
var Vector = require('../model/vector').model;

module.exports = {
  getObj: getObj
};

function getObj(row, col){
	return new Task(function(reject, resolve){
Vector.findOne({row:row})
	});
}*/