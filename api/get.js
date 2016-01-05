'use strict';

var Task = require('data.task');
var Vector = require('../model/vector').model;
var Grid = require('../model/grid').model;
var Shape = require('../model/shape').model;
var R = require('ramda');

var models = {
  vector: Vector,
  grid: Grid,
  shape: Shape
};

module.exports = {
  getVector: R.curry(getVectorUncurried),
  findDocById: R.curry(findByIdUncurried),
  findAndPopulate: R.curry(findAndPopulateUncurried)
};

function getVectorUncurried(grid, vector) {
  return new Task(function(reject, resolve) {
    if (!grid || !grid.id) {
      reject('method_invoke_err');
    }
    Vector.findOne({
        row: vector.row,
        column: vector.column,
        _ofGrid: grid.id
      })
      .then(function(foundVect) {
        resolve(foundVect);
      })
      .then(null, function(err) {
        reject(err);
      });
  });
}

function findByIdUncurried(modelName, docId) {
  var model = models[modelName];
  return new Task(function(reject, resolve) {
    if (!model){
      reject('method_invoke_err');
    }
    model.findOne({
        '_id': docId
      })
      .then(function(doc) {
        resolve(doc);
      })
      .then(null, function(err) {
        reject(err);
      });
  });
}

function findAndPopulateUncurried(modelName, props, docId) {
  var model = models[modelName];
  var concatWithSpace = (a, b) => a === '' ? b : a + ' ' + b;
  var preparedProps = R.reduce(concatWithSpace, '', props);
  return new Task(function(reject, resolve) {
    if (!model){
      reject('method_invoke_err');
    }
    model.findOne({
        '_id': docId
      })
      .populate(preparedProps)
      .exec(foundIt);

      function foundIt(err, doc){
        if (err){
          reject(err);
          return;
        }
        resolve(doc);
      }
  });
}