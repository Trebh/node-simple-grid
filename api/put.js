'use strict';

var Task = require('data.task');
var Grid = require('../model/grid').model;
var R = require('ramda');
var getVector = require('./get').getVector;

module.exports = {
  putObj: R.curry(putObjUncurried)
};

function putObjUncurried(grid, vector) {

  if ((vector.row !== 0 && !vector.row) || (vector.column !== 0 && !vector.column) ||
    !grid || !grid.id) {
    return new Task.rejected('method_invoke_err');
  }

  if ((vector.row > (grid.rows - 1)) || (vector.column > (grid.columns - 1))) {
    return new Task.rejected('boundaries_err');
  }

  return new Task.of(grid)
    .chain(findGrid)
    .map(mapFoundGridRes(vector))
    .chain(getVector(grid))
    .chain(persistVector(vector));

}

function findGrid(grid) {
  return new Task(function(reject, resolve) {
    Grid.findById(grid.id)
      .then(function(foundGrid) {
        resolve(foundGrid);
      }, function(err) {
        reject(err);
      });
  });
}

function mapFoundGridRes(vector) {
  return function(grid) {
    return {
      row: vector.row,
      column: vector.column,
      _ofGrid: grid.id
    };
  };
}

function persistVector(vector) {
  return function(foundVect) {
    return new Task(function(reject, resolve) {
      foundVect.content = vector.content;
      foundVect.save(function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(foundVect);
        return;
      });
    });
  };
}