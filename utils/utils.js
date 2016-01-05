'use strict';

var R = require('ramda');

module.exports = {
	filterVector: R.curry(filterVectorUncurried)
};

function filterVectorUncurried(row, column, arrVects){
	return R.filter(R.curry(correctPos)(row, column), arrVects)[0];
}

function correctPos(row, column,vect){
	return ((vect.row === row) && (vect.column === column));
}