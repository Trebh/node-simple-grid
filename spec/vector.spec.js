'use strict';

var putObj = require('../index').putObj;
var getVector = require('../index').getVector;
var Grid = require('../model/grid').model;

describe('vector API', function() {

  var thisGrid;

  beforeEach(function(done) {
    Grid.findById('5676fea4c397d86c69837232')
      .then(function(grid) {
        thisGrid = grid;
        done();
      });
  });

  var putCall = function(grid, vector, errCb, okCb) {
    putObj(grid, vector)
      .fork(errCb, okCb);
  };
  var getCall = function(grid, vector, errCb, okCb) {
    getVector(grid, vector)
      .fork(errCb, okCb);
  };

  it('should put an obj inside a vector of given test grid', function(done) {

    putCall(thisGrid, {
      row: 2,
      column: 3,
      content: {
        awesomeProp: 'AWESOME!'
      }
    }, handleError, assert);

    function assert(vector) {

      expect(vector.row).toBe(2);
      expect(vector.column).toBe(3);
      expect(vector.content).toBeDefined();
      expect(vector.content.awesomeProp).toBe('AWESOME!');

      done();
    }

    function handleError(_this,done) {
      return function(err){
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
    }, handleError(that,done), assert);

    function assert(vector) {

      expect(vector.row).toBe(1);
      expect(vector.column).toBe(0);
      expect(vector.content).toBeDefined();
      expect(vector.content.message).toBe('hello');

      done();
    }

    function handleError(_this,done) {
      return function(err){
        _this.fail(Error('uh oh, vector api\'s getVector err: ' + err));
        done();
      };
    }

  });

afterEach(function(done) {
  putCall(thisGrid, {
    row: 2,
    column: 3,
    content: {}
  }, handleAfterErr, handleAfterSuccess);

  function handleAfterErr(err) {
    console.error(err);
    done.fail('put obj cleanup err: ' + err);
  }

  function handleAfterSuccess() {
    console.log('clean up');
    done();
  }
});

});