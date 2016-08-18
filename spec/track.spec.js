'use strict';

var createTrack = require('../index').createTrack;
var removeTrack = require('../index').removeTrack;
var createGrid = require('../index').createNewGrid;
var removeGrid = require('../index').removeGrid;
var Task = require('data.task');
var Async = require('control.async')(Task);
var simpleOval = require('../tracks/testTracks/simple_oval').simpleOval;

describe('track specs', function() {

  var thisGrid;
  var newTrack;

  beforeEach(function(done) {
    var toDo = createGrid(20, 20, [], 'track_spec');
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

  var createCall = function(grid, elements, name, errCb, okCb) {
    createTrack(grid, elements, name)
      .fork(errCb, okCb);
  };

  it('should create a track', function(done) {

    var that = this;
    var elementsArr = simpleOval().elements;

    createCall(thisGrid, elementsArr, 'test_track', handleError(that, done), assert);

    function assert(track) {

      expect(track.name).toBe('test_track');
      expect(track.elements.length).toBe(9);

      newTrack = track;
      done();
    }

    function handleError(_this, done) {
      return function(err) {
        _this.fail(Error('uh oh, track api\'s createTrack err: ' + err));
        done();
      };
    }
  });

  afterEach(function(done) {
    var cleanUp = Async.parallel([removeGrid(thisGrid), removeTrack(newTrack)]);
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