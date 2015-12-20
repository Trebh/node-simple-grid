'use strict';

var Task = require('data.task');
var Grid = require('../model/grid').model;
var Vector = require('../model/vector').model;
var R = require('ramda');

module.exports = {
  putObj: R.curry(putObjUncurried)
};

function putObjUncurried(grid, vector) {
  if (!vector.row || !vector.column || !grid || !grid.id) {
    return new Task.rejected('method_invoke_err');
  }

  if ((vector.row > (grid.rows - 1)) || (vector.column > (grid.columns - 1))) {
    return new Task.rejected('boundaries_err');
  }
  return new Task(function(reject, resolve) {
    var thisGrid;
    Grid.findById(grid.id)
      .then(function(grid) {
        thisGrid = grid;
        Vector.findOne({
            row: vector.row,
            column: vector.column,
            _ofGrid: grid.id
          })
          .then(function(foundVect) {
          	if (!foundVect){
          		reject('notfound_err');
          	}
            foundVect.store(vector.content);
            foundVect.save(function(err){
            	if (err){
            		reject(err);
            		return;
            	}
            	resolve(foundVect);
            	return;
            });
          }, function(err) {
            reject(err);
          });
      });
  });
}