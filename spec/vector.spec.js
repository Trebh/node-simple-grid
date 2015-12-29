'use strict';

var putObj = require('../index').putObj;
var getVector = require('../index').getVector;
var moveObj = require('../index').moveObj;
var Task = require('data.task');
var Async = require('control.async')(Task);
var createGrid = require('../index').createNewGrid;
var removeGrid = require('../index').removeGrid;

describe('vector specs', function() {

  var thisGrid;
  var counter = 0;

  beforeEach(function(done) {
    var toDo = createGrid(4, 4, [{
      row: 1,
      column: 0,
      content:{
        message: 'hello'
      }
    },{
      row: 2,
      column: 1,
      content:{
        player: 'moving'
      }
    }], 'vector_spec');
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

  var putCall = function(grid, vector, errCb, okCb) {
    putObj(grid, vector)
      .fork(errCb, okCb);
  };
  var getCall = function(grid, vector, errCb, okCb) {
    getVector(grid, vector)
      .fork(errCb, okCb);
  };
  var moveCall = function(grid, vector, errCb, okCb) {
    var whereTo = {
      column: -1,
      row: 1
    };
    moveObj(grid, vector, whereTo)
      .fork(errCb, okCb);
  };

  it('should put an obj inside a vector of given test grid', function(done) {

    var that = this;
    
    putCall(thisGrid, {
      row: 2,
      column: 3,
      content: {
        awesomeProp: 'AWESOME!'
      }
    }, handleError(that, done), assert);

    function assert(vector) {

      expect(vector.row).toBe(2);
      expect(vector.column).toBe(3);
      expect(vector.content).toBeDefined();
      expect(vector.content.awesomeProp).toBe('AWESOME!');

      done();
    }

    function handleError(_this, done) {
      return function(err) {
        _this.fail(Error('uh oh, vector api\'s putObj err: ' + err));
        done();
      };
    }
  });

  it('should get given test vector', function(done) {

    var that = this;

    getCall(thisGrid, {
      row: 1,
      column: 0
    }, handleError(that, done), assert);

    function assert(vector) {

      expect(vector.row).toBe(1);
      expect(vector.column).toBe(0);
      expect(vector.content).toBeDefined();
      expect(vector.content.message).toBe('hello');

      done();
    }

    function handleError(_this, done) {
      return function(err) {
        _this.fail(Error('uh oh, vector api\'s getVector err: ' + err));
        done();
      };
    }

  });

  it('should move obj to given position', function(done) {

    var that = this;

    moveCall(thisGrid, {
      row: 2,
      column: 1
    }, handleError(that, done), assert);

    function assert(vector) {

      expect(vector.row).toBe(3);
      expect(vector.column).toBe(0);
      expect(vector.content).toBeDefined();
      expect(vector.content.player).toBe('moving');

      done();
    }

    function handleError(_this, done) {
      return function(err) {
        _this.fail(Error('uh oh, vector api\'s moveObj err: ' + err));
        done();
      };
    }

  });

  afterEach(function(done) {

    removeGrid(thisGrid)
      .fork(handleAfterErr, handleAfterSuccess);

    function handleAfterErr(err) {
      console.error(err);
      done.fail('cleanup err: ' + err);
    }

    function handleAfterSuccess() {
      console.log('clean up');
      done();
    }
  });

});