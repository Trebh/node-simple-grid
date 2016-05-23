'use strict';

var R = require('ramda');

module.exports = {
  filterVector: R.curry(filterVectorUncurried),
  vectorObj: R.curry(vectorObjContructorUncurried),
  vectSum: R.curry(vectSumUncurried)(R.__, R.__, 'plus'),
  vectDiff: R.curry(vectSumUncurried)(R.__, R.__, 'minus'),
  vectEq: R.curry(vectEqUncurried),
  vectScalar: R.curry(vectScalarUncurried),
  vectScale: R.curry(vectScaleUncurried),
  vectNorm: R.curry(vectNormUncurried),
  checkElementsConn: checkElements
};

function filterVectorUncurried(row, column, arrVects) {
  return R.filter(R.curry(correctPos)(row, column), arrVects)[0];
}

function correctPos(row, column, vect) {
  return ((vect.row === row) && (vect.column === column));
}

function vectorObjContructorUncurried(row, column, content) {
  return {
    row: row,
    column: column,
    content: content
  };
}

function vectSumUncurried(a, b, sign) {
  if (sign === 'plus') {
    return {
      row: a.row + b.row,
      column: a.column + b.column
    };
  }

  if (sign === 'minus') {
    return {
      row: a.row - b.row,
      column: a.column - b.column
    };
  }
}

function vectEqUncurried(a, b) {
  return (a && b && (a.row === b.row) && (a.column === b.column));
}

function checkElements(els) {

  if (!els || els.length < 3) {
    return false;
  }

  var safeSortedEls = R.sortBy(R.prop('order'), els);
  safeSortedEls.push(safeSortedEls[0]);
  return R.reduce(pointToNextEl, {
    isPrevoiousOk: true,
    elem: null
  }, safeSortedEls).isPrevoiousOk;
}

function pointToNextEl(a, b) {
  if (!a.isPrevoiousOk) {
    return a;
  }
  if (!a.elem) {
    return {
      isPrevoiousOk: true,
      elem: b
    };
  }

  var nextShouldBe = vectSumUncurried(a.elem.origin, a.elem.direction, 'plus');
  return {
    isPrevoiousOk: vectEqUncurried(nextShouldBe, b.origin),
    elem: b
  };
}

function vectScalarUncurried(a, b) {
  return (a.row * b.row) + (a.column * b.column);
}

function vectNormUncurried(a) {
  return Math.sqrt(vectScalarUncurried(a, a));
}

function vectScaleUncurried(k, vect) {
  return {
    row: k * vect.row,
    column: k * vect.column
  };
}