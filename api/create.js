'use strict';

var Grid = require('../model/grid').model;
var Vector = require('../model/vector').model;
var Task = require('data.task');
var R = require('ramda');
var Async = require('control.async')(Task);

module.exports = {
  createNewGrid: createNewGrid
};

function createNewGrid(rows, columns) {

  var newGrid = new Grid({
    rows: rows,
    columns: columns
  });

  var vectors = initVectors(rows, columns, newGrid);
  newGrid.vectors = R.pluck('id', vectors);

  return new Task(function(reject, resolve) {
      newGrid.save(function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(newGrid);
        return;
      });
    })
    .chain(function(savedGrid) {
      newGrid = savedGrid;
      var saveAllVectors = Async.parallel(R.map(saveVector, vectors));
      return saveAllVectors;
    })
    .map(function(savedVectors) {
      return newGrid;
    });
}

function initVectors(rows, columns, grid) {

  var vectors = R.repeat({}, rows * columns);
  vectors = R.map(newVectGrid(grid),vectors);

  var iterator = getIterator(rows, columns)();

  return R.map(setBaseVectorPos(iterator), vectors);

}

function newVectGrid(grid) {
  return function newVect() {
    return new Vector({
      row: 0,
      column: 0,
      content: JSON.stringify({}),
      _ofGrid: grid.id
    });
  };

}

function setBaseVectorPos(iterator) {
  return function(vector) {
    var vectorPos = iterator.next();
    vector.column = vectorPos.value.column;
    vector.row = vectorPos.value.row;
    return vector;
  };
}

function getIterator(rows, columns) {
  return function* getVector() {
    var col = 0;
    while (col < columns) {
      var row = 0;
      while (row < rows) {
        yield {
          row: row,
          column: col
        };
        row++;
      }
      col++;
    }
  };
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