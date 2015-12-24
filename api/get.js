'use strict';

var Task = require('data.task');
var Vector = require('../model/vector').model;

module.exports = {
  getVector: getVector
};

function getVector(grid, vector) {
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
      .then(null, function(err){
      	reject(err);
      });
  });
}