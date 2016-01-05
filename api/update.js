'use strict';

var Task = require('data.task');
var R = require('ramda');
var getVector = require('./get').getVector;
var putObj = require('./put').putObj;
var removeObj = require('./delete').removeObj;

module.exports = {
  moveObj: R.curry(sumVectorsUncurried),
  updateVector: R.curry(updateVectorUncurried)
};

var tempVectRes;

function sumVectorsUncurried(grid, vector, whereTo) {

  var v1 = R.clone(whereTo);
  var v2 = R.clone(vector);

  tempVectRes = {};

  return new Task.of(v2)
    .chain(getVector(grid))
    .map(R.curry(objNewPositionUncurried)(v1))
    .chain(putObj(grid))
    .map(storeTempRes(v2)) //MEH
    .chain(removeObj(grid))
    .map(restoreTempRes);
}

function objNewPositionUncurried(v1, v2) {
  var vRes = {
    column: R.add(v1.column, v2.column),
    row: R.add(v1.row, v2.row),
    content: v2.content
  };
  return vRes;
}

function storeTempRes(oldVect) {
  return function(newVect) {
    tempVectRes = newVect;
    return (oldVect);
  };
}

function restoreTempRes() {
  return tempVectRes;
}

function updateVectorUncurried(grid, vector) {
  return new Task.of(vector)
    .chain(getVector(grid))
    .map(R.curry(mergeVectors)(vector))
    .chain(saveVector);
}

function mergeVectors(newVector, oldVector) {
  var mergedVector = oldVector;
  var isNull = function(a) {
    return ((a === null) || (a === undefined));
  };
  if (!(isNull(newVector.column))) {
    mergedVector.column = newVector.column;
  }
  if (!(isNull(newVector.row))) {
    mergedVector.row = newVector.row;
  }
  if (!(isNull(newVector._ofShape))) {
    mergedVector._ofShape = newVector._ofShape;
  }
  if (!(isNull(newVector._ofElement))) {
    mergedVector._ofElement = newVector._ofElement;
  }

  return mergedVector;

}

function saveVector(vector) {
  return new Task(function(reject, resolve) {
    vector.save(function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(vector);
      return;
    });
  });
}