'use strict';

var Grid = require('../model/grid').model;
var Vector = require('../model/vector').model;
var Task = require('data.task');
var Async = require('control.async')(Task);
var R = require('ramda');

module.exports = {
  removeGrid: removeGrid
};

function removeGrid(grid){
  return new Task.of(grid)
    .chain(removeVectorsStep)
    .chain(removeGridStep);
}

function removeVectorsStep(grid) {
  return Async.parallel(R.map(findVector, grid.vectors))
    .map(function(){
      return grid;
    });
}

function removeGridStep(grid) {
  return new Task(function(reject, resolve) {
    Grid.findByIdAndRemove(grid.id)
      .then(function() {
        resolve(true);
      }, function(err) {
        reject(err);
      });
  });
}

function findVector(objId) {
  return new Task(function(reject, resolve) {
    Vector.findByIdAndRemove(objId)
      .then(function(){
        resolve(true);
      }, function(err){
        reject(err);
      });
  });
}