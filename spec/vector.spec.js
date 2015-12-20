'use strict';

var putObj = require('../index').putObj;
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

  var putCall = function(grid, vector, cb1, cb2){
    putObj(grid, vector)
      .fork(cb1, cb2);
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
      expect(vector.getContent()).toBeDefined();
      expect(vector.getContent().awesomeProp).toBe('AWESOME!');

      done();
    }

    function handleError(err) {
      done.fail('uh oh, vector api\'s putObj err ', err);
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
      done();
    }
  });

});