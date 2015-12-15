'use strict';

var Grid = require('../model/grid').model;
var Task = require('data.task');

module.exports = {
  removeGrid: removeGrid
};

function removeGrid(grid) {
  return new Task(function(reject, resolve) {
    Grid.findByIdAndRemove(grid.id)
      .then(function() {
        resolve(true);
      }, function(err) {
        reject(err);
      });
  });
}