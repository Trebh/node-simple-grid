'use strict';

var utils = require('../utils/utils');

describe('utils specs', function() {

  it('should get a vector from an array, given its properties', function() {

    var arrVects = [{
      row: 0,
      column: 0
    }, {
      row: 1,
      column: 5
    }, {
      row: 3,
      column: 4
    }, {
      row: -1,
      column: 7
    }];

    var result = utils.filterVector(-1, 7, arrVects);

    expect(result).toBeDefined();
    expect(result.row).toBe(-1);
    expect(result.column).toBe(7);

  });

  it('should sum two given vectors', function() {

    var a = {
      row: 3,
      column: -5
    };
    var b = {
      row: -1,
      column: 6
    };

    var result = utils.vectSum(a, b);

    expect(result).toBeDefined();
    expect(result.row).toBe(2);
    expect(result.column).toBe(1);

  });

  it('should sum two given vectors', function() {

    var a = {
      row: 3,
      column: -5
    };
    var b = {
      row: -1,
      column: 6
    };

    var result = utils.vectSum(a, b);

    expect(result).toBeDefined();
    expect(result.row).toBe(2);
    expect(result.column).toBe(1);

  });

  it('should compare two given vectors', function() {

    var a = {
      row: 3,
      column: -5
    };
    var b = {
      row: -1,
      column: 6
    };
    var c = {
      row: 3,
      column: -5
    };

    var incorrect = utils.vectEq(a, b);
    var correct = utils.vectEq(a, c);

    expect(correct).toBe(true);
    expect(incorrect).toBe(false);

  });

  it('should scale a given vector', function() {

    var a = {
      row: 2,
      column: -1
    };
    var k = -4;

    var result = utils.vectScale(k, a);

    expect(result).toBeDefined();
    expect(result.row).toBe(-8);
    expect(result.column).toBe(4);

  });

  it('should exec scalar product of two given vectors', function() {

    var a = {
      row: 3,
      column: -5
    };
    var b = {
      row: -1,
      column: 6
    };

    var result = utils.vectScalar(a, b);

    expect(result).toBeDefined();
    expect(result).toBe(-33);

  });

  it('should calculate the norm of a given vector', function() {

    var a = {
      row: 3,
      column: -4
    };

    var result = utils.vectNorm(a);

    expect(result).toBeDefined();
    expect(result).toBe(5);

  });

});