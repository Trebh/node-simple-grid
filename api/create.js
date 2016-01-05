'use strict';

var Grid = require('../model/grid').model;
var Vector = require('../model/vector').model;
var Task = require('data.task');
var R = require('ramda');
var Async = require('control.async')(Task);
var putObj = require('./put').putObj;
var Shape = require('../model/shape').model;
var getVector = require('./get').getVector;
var updateVectorProp = require('./update').updateVector;

module.exports = {
  createNewGrid: R.curry(createNewGridUncurried),
  createShape: R.curry(createShapeUncurried)
};

function createNewGridUncurried(rows, columns, vects, name) {

  if (!rows || !columns) {
    return new Task.rejected('method_invoke_err');
  }

  var newGrid = new Grid({
  	name: name,
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
    .chain(function() {
      if (!vects || vects.length === 0) {
        return new Task.of(newGrid);
      } else {
        var updateAllVectors = Async.parallel(R.map(updateVectorContent(newGrid),
          vects));
        return updateAllVectors;
      }
    })
    .map(function() {
      return newGrid;
    });
}

function initVectors(rows, columns, grid) {

  var vectors = R.repeat({}, rows * columns);
  vectors = R.map(newVectGrid(grid), vectors);

  var iterator = getIterator(rows, columns)();

  return R.map(setBaseVectorPos(iterator), vectors);

}

function newVectGrid(grid) {
  return function newVect() {
    return new Vector({
      row: 0,
      column: 0,
      content: {},
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

function updateVectorContent(grid) {
  return function(vector) {
    return putObj(grid, vector);
  };
}

function createShapeUncurried(grid, vectors, name) {

	var modelVectors = R.map(R.curry(vectToModel)(grid), vectors);

  var newShape = new Shape({
  	name: name,
  	modelVectors,
  	_ofGrid: grid.id
  });

  var findVectsTask = R.map(getVector(grid), modelVectors);
  return Async.parallel(findVectsTask)
  	.chain(noNullResults)
  	.chain(R.curry(updateVectorsShape)(grid, newShape))
  	.map(passNewShape(newShape))
  	.chain(persistShape);
}

function persistShape(shape){
	return new Task(function(reject, resolve){
		shape.save(function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(shape);
      return;
    });
	});
}

function passNewShape(shape){
	return function(vectors){
		shape.vectors = vectors;
		return shape;
	};
}

function noNullResults(arrRes){
	var isNull = function(a){
		return ((a === null) || (a === undefined));
	};
	return new Task(function(reject,resolve){
		if (R.any(isNull, arrRes)){
			reject('err_vector_not_found');
			return;
		} else {
			resolve(arrRes);
			return;
		}
	});
}

function updateVectorsShape(grid, shape, arrVects){
	var newArr = R.map(R.curry(insertShape)(shape), arrVects);
	var updateTasks = R.map(updateVectorProp(grid), newArr);
	return Async.parallel(updateTasks);
}

function insertShape(shape, vect){
	vect._ofShape = shape.id;
	return vect;
}

function vectToModel(grid, vect){
	return new Vector({
		row: vect.row,
		column: vect.column,
		_ofGrid: grid.id,
		content: vect.content
	});
}