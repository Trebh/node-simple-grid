'use strict';

var Task = require('data.task');
var R = require('ramda');
var getVector = require('./get').getVector;
var putObj = require('./put').putObj;
var removeObj = require('./delete').removeObj;

module.exports = {
  moveObj: R.curry(sumVectorsUncurried)
};

var tempVectRes;

function sumVectorsUncurried(grid, vector, whereTo){

	var v1 = R.clone(whereTo);
	var v2 = R.clone(vector);

	tempVectRes = {};

	return new Task.of(v2)
		.chain(getVector(grid))
		.map(R.curry(objNewPositionUncurried)(v1))
		.chain(putObj(grid))
		.map(storeTempRes(v2))					//MEH
		.chain(removeObj(grid))
		.map(restoreTempRes);
}

function objNewPositionUncurried(v1, v2){
	var vRes = {
		column: R.add(v1.column, v2.column),
		row: R.add(v1.row, v2.row),
		content: v2.content
	};
	return vRes;
}

function storeTempRes(oldVect){
	return function(newVect){
		tempVectRes = newVect;
		return(oldVect);
	};
}

function restoreTempRes(){
	return tempVectRes;
}