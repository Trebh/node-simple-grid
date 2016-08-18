'use strict';

var Vector = require('../model/vector').model;
var Task = require('data.task');
var Async = require('control.async')(Task);
var R = require('ramda');
var putObj = require('./put').putObj;
var findDocById = require('./get').findDocById;

module.exports = {
  removeGrid: R.curry(removeDocAndSubDocs)('vectors'),
  removeObj: R.curry(removeObjUncurried),
  removeShape: R.curry(removeDocAndDeassociateVectsUncurried)('_ofShape'),
  removeTrack: R.curry(removeDocAndSubDocs)('elements')
};

function removeDocAndSubDocs(subModelName, doc) {
  return new Task.of(doc)
    .chain(R.curry(removeSubDocsStep)(subModelName))
    .chain(removeDocStep);
}

function removeSubDocsStep(subModelName, doc) {
  return Async.parallel(R.map(findAndRemoveFromDocID, doc[subModelName]))
    .map(function() {
      return doc;
    });
}

function removeDocStep(doc) {
  return new Task(function(reject, resolve) {
    doc.constructor.findByIdAndRemove(doc.id)
      .then(function() {
        resolve(true);
      }, function(err) {
        reject(err);
      });
  });
}

function findAndRemoveFromDocID(objId) {
  return new Task(function(reject, resolve) {
    Vector.findByIdAndRemove(objId)
      .then(function() {
        resolve(true);
      }, function(err) {
        reject(err);
      });
  });
}

function removeObjUncurried(grid, vector) {
  vector.content = {};
  return putObj(grid, vector);
}

function removeDocAndDeassociateVectsUncurried(prop, doc) {
  return new Task.of(doc)
    .chain(R.curry(deassocVects)(prop))
    .chain(removeDocStep);
}

function deassocVects(prop, doc) {
  return Async.parallel(R.map(R.curry(findAndDeassocVector)(prop), doc.vectors))
    .map(function() {
      doc.vectors = [];
      return doc;
    });
}

function findAndDeassocVector(prop, vectId) {
  return new Task.of(vectId)
    .chain(findDocById('vector'))
    .map(R.curry(resetProp)(prop))
    .chain(saveVector);
}

function resetProp(prop, vect) {
  vect[prop] = undefined;
  return vect;
}

function saveVector(vector) {
  return new Task(function(reject, resolve) {
    vector.save(function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(vector);
      return;
    });
  });
}