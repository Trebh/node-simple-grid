'use strict';

var createShape = require('../index').createShape;
var removeShape = require('../index').removeShape;
var createGrid = require('../index').createNewGrid;
var removeGrid = require('../index').removeGrid;
var Task = require('data.task');
var Async = require('control.async')(Task);

describe('shape specs', function() {

  var thisGrid;
  var newShape;

  beforeEach(function(done) {
    var toDo = createGrid(4, 4, [], 'shape_spec');
    toDo.fork(handleErr, handleSuccess);

    function handleErr(err) {
      console.error(err);
      fail('grid creation error: ' + err);
      done();
    }

    function handleSuccess(data) {
      thisGrid = data;
      done();
    }

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
    }, {
      row: 0,
      column: 2
    }, {
      row: 0,
      column: 3
    }, {
      row: 1,
      column: 1
    }];

    createCall(thisGrid, vectorArr, 'test_shape', handleError(that, done), assert);

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
    var cleanUp = Async.parallel([removeShape(newShape), removeGrid(thisGrid)]);
    cleanUp
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