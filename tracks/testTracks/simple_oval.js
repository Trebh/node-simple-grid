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
    width: 4,
    origin: utils.vectorObj(15, 10, {}),
    direction: utils.vectorObj(-4, 0, {})
  };

  var el1 = {
    name: 'prima curva',
    order: 1,
    vectors: [],
    width: 4,
    origin: utils.vectorObj(11, 10, {}),
    direction: utils.vectorObj(-3, 3, {})
  };

  var el2 = {
    name: 'rettilineo corto 1',
    order: 2,
    vectors: [],
    width: 4,
    origin: utils.vectorObj(8, 13, {}),
    direction: utils.vectorObj(0, 4, {})
  };

  var el3 = {
    name: 'seconda curva',
    order: 3,
    vectors: [],
    width: 4,
    origin: utils.vectorObj(8, 17, {}),
    direction: utils.vectorObj(3, 3, {})
  };

  var el4 = {
    name: 'secondo rettilineo',
    order: 4,
    vectors: [],
    width: 4,
    origin: utils.vectorObj(11, 20, {}),
    direction: utils.vectorObj(8, 0, {})
  };

  var el5 = {
    name: 'terza curva',
    order: 5,
    vectors: [],
    width: 4,
    origin: utils.vectorObj(19, 20, {}),
    direction: utils.vectorObj(3, -3, {})
  };

  var el6 = {
    name: 'rettilineo corto 2',
    order: 6,
    vectors: [],
    width: 4,
    origin: utils.vectorObj(22, 17, {}),
    direction: utils.vectorObj(0, -4, {})
  };

  var el7 = {
    name: 'quarta curva',
    order: 7,
    vectors: [],
    width: 4,
    origin: utils.vectorObj(22, 13, {}),
    direction: utils.vectorObj(-4, -3, {})
  };

  var el8 = {
    name: 'arrivo',
    order: 8,
    vectors: [],
    width: 4,
    origin: utils.vectorObj(18, 10, {}),
    direction: utils.vectorObj(-3, 0, {})
  };

  track.elements = [el0, el1, el2, el3, el4, el5, el6, el7, el8];

  return track;
}