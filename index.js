/*! revalidator-model 0.1.0 Original author Alan Plum <me@pluma.io>. Released into the Public Domain under the UNLICENSE. @preserve */
var revalidator = require('revalidator'),
  filterObj = require('object-filter'),
  transform = require('transform-object');

module.exports = model;

function model(schema) {
  schema = schema || {};

  function Model(data) {
    var self = this;
    if (!Model.prototype.isPrototypeOf(self)) {
      return new Model(data);
    }
    self.data = filterObj(data || {}, function(v, k) {
      if (self.schema.properties && k in self.schema.properties) {
        return true;
      }
      return (
        self.schema.patternProperties &&
        Object.keys(self.schema.patternProperties).some(function(str) {
          return (new RegExp(str)).test(k);
        })
      );
    });
    return self;
  }

  Model.prototype = Object.create(schema.proto || Object.prototype);
  Model.prototype.schema = schema;
  Model.prototype.validate = function() {
    return revalidator.validate(this.data, this.schema);
  };
  Model.prototype.dehydrate = function() {
    return transform(this.data, this.schema.dehydrate);
  };
  Model.hydrate = function(data) {
    return new Model(transform(data || {}, Model.prototype.schema.hydrate));
  };

  return Model;
}