/*! revalidator-model 0.4.1 Original author Alan Plum <me@pluma.io>. Released into the Public Domain under the UNLICENSE. @preserve */
var revalidator = require('revalidator'),
  filterObj = require('object-filter'),
  transform = require('transform-object'),
  clone = require('clone'),
  aug = require('aug');

module.exports = exports = model;
exports.deepCall = deepCall;

function deepCall(obj) {
  if (!obj) return obj;
  if (typeof obj === 'function') {
    return obj();
  }
  if (typeof obj === 'object') {
    Object.keys(obj).forEach(function(key) {
      obj[key] = deepCall(obj[key]);
    });
  }
  return obj;
}

function model(schema) {
  schema = schema || {};

  function Model(data) {
    var self = this;
    if (!Model.prototype.isPrototypeOf(self)) {
      return new Model(data);
    }
    aug(self, deepCall(clone(Model.schema.defaults) || {}), filterObj(data || {}, function(v, k) {
      if (Model.schema.properties && k in Model.schema.properties) {
        return true;
      }
      return (
        Model.schema.patternProperties &&
        Object.keys(Model.schema.patternProperties).some(function(str) {
          return (new RegExp(str)).test(k);
        })
      );
    }));
    return self;
  }

  Model.schema = schema;
  Model.prototype = Object.create(schema.proto || Object.prototype);
  Model.prototype.constructor = Model;
  Model.prototype.validate = function() {
    return Model.validate(this);
  };
  Model.prototype.dehydrate = function() {
    return transform(this, Model.schema.dehydrate);
  };
  Model.validate = function(data) {
    return revalidator.validate(data, Model.schema);
  };
  Model.hydrate = function(data) {
    var initial = deepCall(clone(Model.schema.defaults) || {});
    return new Model(transform(aug(initial, data), Model.schema.hydrate));
  };

  return Model;
}
