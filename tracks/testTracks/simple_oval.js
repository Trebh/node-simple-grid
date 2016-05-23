'use strict';

var utils = require('../../utils/utils');

module.exports = {
  simpleOval: simpleOval
};

function simpleOval() {

  var track = {};

  // ELEMENTS

  var el0 = {
    name: 'rettilineo arrivo',
    order: 0,
    vectors: [],
    width: 3,
    origin: utils.vectorObj(10, 4, {}),
    direction: utils.vectorObj(-4, 0, {})
  };

  var el1 = {
    name: 'prima curva',
    order: 1,
    vectors: [],
    width: 3,
    origin: utils.vectorObj(6, 4, {}),
    direction: utils.vectorObj(-2, 2, {})
  };

  var el2 = {
    name: 'rettilineo corto 1',
    order: 2,
    vectors: [],
    width: 3,
    origin: utils.vectorObj(4, 6, {}),
    direction: utils.vectorObj(0, 2, {})
  };

  var el3 = {
    name: 'seconda curva',
    order: 3,
    vectors: [],
    width: 3,
    origin: utils.vectorObj(4, 8, {}),
    direction: utils.vectorObj(3, 3, {})
  };

  var el4 = {
    name: 'secondo rettilineo',
    order: 4,
    vectors: [],
    width: 3,
    origin: utils.vectorObj(7, 11, {}),
    direction: utils.vectorObj(5, 0, {})
  };

  var el5 = {
    name: 'terza curva',
    order: 5,
    vectors: [],
    width: 3,
    origin: utils.vectorObj(12, 11, {}),
    direction: utils.vectorObj(3, -3, {})
  };

  var el6 = {
    name: 'rettilineo corto 2',
    order: 6,
    vectors: [],
    width: 3,
    origin: utils.vectorObj(15, 8, {}),
    direction: utils.vectorObj(0, -2, {})
  };

  var el7 = {
    name: 'quarta curva',
    order: 7,
    vectors: [],
    width: 3,
    origin: utils.vectorObj(15, 6, {}),
    direction: utils.vectorObj(-2, -2, {})
  };

  var el8 = {
    name: 'arrivo',
    order: 8,
    vectors: [],
    width: 3,
    origin: utils.vectorObj(13, 4, {}),
    direction: utils.vectorObj(-3, 0, {})
  };

  track.elements = [el0, el1, el2, el3, el4, el5, el6, el7, el8];

  return track;
}