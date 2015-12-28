'use strict';

var createShape = require('../index').createShape;
var removeShape = require('../index').removeShape;
var Grid = require('../model/grid').model;

describe('shape specs', function() {

  var thisGrid;
  var newShape;

  beforeEach(function(done) {
    Grid.findById('56815f87bf8f65573ad30937')
      .then(function(grid) {
        thisGrid = grid;
        done();
      });
  });

  var createCall = function(grid, vectors, name, errCb, okCb) {
    createShape(grid, vectors, name)
      .fork(errCb, okCb);
  };

  it('should create a shape', function(done) {

  	var that = this;
  	var vectorArr = [{
  		row: 0,
      column: 1
  	},{
  		row: 0,
      column: 2
  	},{
  		row: 0,
      column: 3
  	},{
  		row: 1,
      column: 1
  	}];

    createCall(thisGrid, vectorArr, 'test_shape', handleError(that,done), assert);

    function assert(shape) {

      expect(shape.name).toBe('test_shape');
      expect(shape.vectors.length).toBe(4);

      newShape = shape;
      done();
    }

    function handleError(_this, done) {
      return function(err) {
        _this.fail(Error('uh oh, vector api\'s createShape err: ' + err));
        done();
      };
    }
  });

	afterEach(function(done) {
    removeShape(newShape)
      .fork(handleAfterErr, handleAfterSuccess);
    function handleAfterErr(err) {
      console.error(err);
      done.fail('grid deletion error: ' + err);
    }

    function handleAfterSuccess() {
      done();
    }
  });

});