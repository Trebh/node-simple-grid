'use strict';

var createGrid = require('../index').createNewGrid;
var removeGrid = require('../index').removeGrid;

describe('grid Creation', function() {

  var newGrid;

  beforeEach(function(done) {
    var toDo = createGrid(2, 2);
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

  it('should create a grid with 2 rows and 2 columns', function(done) {
    
    expect(newGrid.rows).toBe(2);
    expect(newGrid.columns).toBe(2);
    expect(newGrid.id).toBeDefined();
    expect(newGrid.vectors.length).toBe(4);
    done();
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