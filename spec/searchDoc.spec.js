'use strict';

var createGrid = require('../index').createNewGrid;
var searchDoc = require('../index').searchDoc;
var removeGrid = require('../index').removeGrid;

describe('searchDoc Specs', function() {

  var newGrid;

  beforeEach(function(done) {
    var vectors = [];
    var toDo = createGrid(2, 3, vectors, 'searchThisOut');
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

  var searchDocCall = function(modelName, conditionsObj, errCb, okCb) {
    searchDoc(modelName, conditionsObj)
      .fork(errCb, okCb);
  };

  it('should find a test Doc', function(done) {

    var that = this;

    var conditions = {
      name: 'searchThisOut',
      rows: 2,
      columns: 3
    };

    searchDocCall('grid', conditions, handleError(that, done), assert);

    function assert(foundGrid) {

      expect(newGrid.rows).toBe(2);
      expect(newGrid.columns).toBe(3);
      expect(foundGrid.name).toBe('searchThisOut');
      expect(foundGrid.vectors.length).toBe(6);

      done();
    }

    function handleError(_this, done) {
      return function(err) {
        _this.fail(Error('uh oh, api\'s searchDoc err: ' + err));
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