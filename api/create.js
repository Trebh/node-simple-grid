'use strict';

var Grid = require('../model/grid').model;
var Vector = require('../model/vector').model;
var Element = require('../model/element').model;
var Track = require('../model/track').model;
var Task = require('data.task');
var R = require('ramda');
var Async = require('control.async')(Task);
var putObj = require('./put').putObj;
var Shape = require('../model/shape').model;
var getVector = require('./get').getVector;
var findAndPopulate = require('./get').findAndPopulate;
var updateVectorProp = require('./update').updateVector;
var utils = require('../utils/utils');

var models = {
  vector: Vector,
  grid: Grid,
  shape: Shape,
  element: Element,
  track: Track
};

module.exports = {
  createNewGrid: R.curry(createNewGridUncurried),
  createShape: R.curry(createShapeUncurried),
  createTrack: R.curry(createTrackUncurried)
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
      var saveAllVectors = Async.parallel(R.map(R.curry(saveModel)('vector'), vectors));
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

function saveModel(modelName, obj) {
  var model = models[modelName];
  return new Task(function(reject, resolve) {
    if (!model) {
      reject('unknow model name');
    }
    obj.save(function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(obj);
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

function persistShape(shape) {
  return new Task(function(reject, resolve) {
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

function passNewShape(shape) {
  return function(vectors) {
    shape.vectors = vectors;
    return shape;
  };
}

function noNullResults(arrRes) {
  var isNull = function(a) {
    return ((a === null) || (a === undefined));
  };
  return new Task(function(reject, resolve) {
    if (R.any(isNull, arrRes)) {
      reject('err_vector_not_found');
      return;
    } else {
      resolve(arrRes);
      return;
    }
  });
}

function updateVectorsShape(grid, shape, arrVects) {
  var newArr = R.map(R.curry(insertShape)(shape), arrVects);
  var updateTasks = R.map(updateVectorProp(grid), newArr);
  return Async.parallel(updateTasks);
}

function insertShape(shape, vect) {
  vect._ofShape = shape.id;
  return vect;
}

function vectToModel(grid, vect) {
  return new Vector({
    row: vect.row,
    column: vect.column,
    _ofGrid: grid.id,
    content: vect.content
  });
}

function createTrackUncurried(grid, elements, name) {
  if (!utils.checkElementsConn(elements)) {
    return Task.rejected('elements can not be disconnected');
  }
  return new Task.of(grid.id)
    .chain(R.curry(findAndPopulate)('grid', ['vectors']))
    .chain(R.curry(createElements)(R.__, elements))
    .chain(R.curry(saveTrack)(grid, R.__, name));
}

function createElements(grid, elements) {

  var preparedElements = R.map(R.compose(R.curry(prepareElementVectors)(grid), R.curry(prepareOriginDirection)(grid)), elements);
  //var allVectors = R.concat(R.flatten(R.pluck('vectors', preparedElements)), R.pluck('origin', preparedElements), R.pluck('direction', preparedElements));

  var buildElTask = R.compose(R.curry(saveModel)('element'), R.curry(usingConstructor)(grid));
  //var buildVectTask = R.curry(saveModel)('vector');

  return Async.parallel(R.map(buildElTask, preparedElements));

  function usingConstructor(grid, el) {
    el._ofGrid = grid.id || grid._id;
    return new Element(el);
  }
}

function prepareElementVectors(grid, element) {
  var elementVectors = R.filter(R.curry(checkPosDistance)(element.origin, element.direction, element.width), grid.vectors);
  element.vectors = elementVectors;
  return element;
}

function checkPosDistance(origin, direction, width, vectorToCheck) {
  var diffVect = utils.vectDiff(vectorToCheck, origin);
  var coeffProjection = utils.vectScalar(diffVect, direction) / utils.vectScalar(direction, direction);
  var dist = utils.vectNorm(utils.vectDiff(diffVect, utils.vectScale(coeffProjection, direction)));

  return ((coeffProjection >= 0) && (coeffProjection <= 1) && (dist <= width));
}

function prepareOriginDirection(grid, element) {

  var orig = new Vector({
    row: element.origin.row,
    column: element.origin.column,
    content: {},
    _ofGrid: grid.id || grid._id
  });

  var direction = new Vector({
    row: element.direction.row,
    column: element.direction.column,
    content: {},
    _ofGrid: grid.id || grid._id
  });

  element.origin = orig;
  element.direction = direction;

  return element;
}

function saveTrack(grid, elements, name) {
  var elementIds = R.pluck('id', elements);
  var track = new Track({
    name: name,
    elements: elementIds,
    _ofGrid: grid.id
  });

  return saveModel('track', track);
}