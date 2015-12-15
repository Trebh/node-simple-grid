'use strict';

var Grid = require('../model/grid').model;
var Task = require('data.task');

module.exports = {
  createGrid: createGrid
};

function createGrid(rows, columns) {
  var newGrid = new Grid({
    rows: rows,
    columns: columns
  });
  return new Task(function(reject, resolve) {
    newGrid.save(function(err) {
      if (err) {
        reject(err);
      }
      resolve(newGrid);
      return newGrid;
    });
  });
}