'use strict';

var createGrid = require('../index').createNewGrid;
var findAndPopulate = require('../index').findAndPopulate;
var removeGrid = require('../index').removeGrid;
var R = require('ramda');
var filterVector = require('../utils/utils').filterVector;

describe('grid Specs', function() {

  var newGrid;

  beforeEach(function(done) {
    var vectors = [];
    vectors.push({
      row:1,
      column:0,
      content:{
        myProp:'bazinga'
      }
    });
    var toDo = createGrid(2, 2, vectors, 'testsAreFun');
    toDo.fork(handleErr, handleSuccess);

    function handleErr(err) {
      console.error(err);
      fail('grid creation error: ' + err);
      done();
    }

    function handleSuccess(data) {
      newGrid = data;
      done();
    }
  });

  var getPopGridCall = function(model, props, docId, errCb, okCb) {
    findAndPopulate(model, props, docId)
      .fork(errCb, okCb);
  };

  it('should create a grid with 2 rows and 2 columns', function(done) {
    
    expect(newGrid.name).toBe('testsAreFun');
    expect(newGrid.rows).toBe(2);
    expect(newGrid.columns).toBe(2);
    expect(newGrid.id).toBeDefined();
    expect(newGrid.vectors.length).toBe(4);
    done();
  });

  it('should get a populated grid', function(done) {

    var that = this;

    getPopGridCall('grid', ['vectors'], newGrid.id , handleError(that, done), assert);

    function assert(foundGrid) {

      var vectors = foundGrid.vectors;
      var myVector = filterVector(1, 0, vectors);

      expect(foundGrid.name).toBe('testsAreFun');
      expect(foundGrid.vectors.length).toBe(4);
      expect(myVector.content.myProp).toBe('bazinga');

      done();
    }

    function handleError(_this, done) {
      return function(err) {
        _this.fail(Error('uh oh, api\'s findAndPopulate err: ' + err));
        done();
      };
    }

  });

  //cleanup
  afterEach(function(done) {
    removeGrid(newGrid)
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