/*global describe, it */
var expect = require('expect.js'),
  model = require('../');

describe('model(schema)', function() {
  it('is a function', function() {
    expect(model).to.be.a('function');
  });
  it('returns a Model constructor', function() {
    var Ctor = model();
    expect(Ctor).to.be.a('function');
    expect(Ctor).to.have.property('prototype');
    expect(Ctor.prototype).to.be.an('object');
  });
  it('exposes the schema', function() {
    var schema = {};
    var Model = model(schema);
    expect(Model).to.have.property('schema', schema);
  });
  it('extends schema.proto', function() {
    var schema = {proto: {}};
    var proto = model(schema).prototype;
    expect(Object.getPrototypeOf(proto)).to.equal(schema.proto);
  });
});

describe('Model.hydrate(data)', function() {
  it('is a method', function() {
    var Model = model();
    expect(Model).to.have.property('hydrate');
    expect(Model.hydrate).to.be.a('function');
  });
  it('returns a Model instance', function() {
    var Model = model();
    var obj = Model.hydrate();
    expect(obj).to.be.a(Model);
    expect(Object.getPrototypeOf(obj)).to.equal(Model.prototype);
  });
  it('uses the schema\'s "hydrate" transformation', function() {
    var called = false, calledWith = null;
    var Model = model({
      additionalProperties: true,
      hydrate: function(arg) {
        calledWith = arg;
        called = true;
      }
    });
    var data = {foo: 'bar'};
    Model.hydrate(data);
    expect(called).to.equal(true);
    expect(calledWith).to.eql(data);
  });
});

describe('new Model(data)', function() {
  var Model = model({
    properties: {foo: true, bar: true},
    patternProperties: {'^f0[01]$': true}
  });
  it('returns a Model instance', function() {
    var obj = Model({});
    expect(obj).to.be.a(Model);
    expect(Object.getPrototypeOf(obj)).to.equal(Model.prototype);
  });
  it('copies matching attributes', function() {
    var obj = Model({foo: 'a', bar: 'b'});
    expect(obj).to.have.property('foo');
    expect(obj.foo).to.equal('a');
    expect(obj).to.have.property('bar');
    expect(obj.bar).to.equal('b');
  });
  it('copies pattern matching attributes', function() {
    var obj = Model({f00: 'a', f01: 'b', f000: 'c'});
    expect(obj).to.have.property('f00');
    expect(obj.f00).to.equal('a');
    expect(obj).to.have.property('f01');
    expect(obj.f01).to.equal('b');
    expect(obj).to.not.have.property('f000');
  });
  it('does not simply copy the data object', function() {
    var data = {};
    var obj = Model(data);
    expect(obj).to.not.equal(data);
  });
  it('ignores unknown attributes', function() {
    var obj = Model({bar: 'b', qux: 'c'});
    expect(obj).to.have.property('bar');
    expect(obj.bar).to.equal('b');
    expect(obj).to.not.have.property('qux');
  });
});
describe('instance.dehydrate()', function() {
  it('is a method', function() {
    var obj = model({})({});
    expect(obj).to.have.property('dehydrate');
    expect(obj.dehydrate).to.be.a('function');
  });
  it('returns an object with the instance\'s data', function() {
    var Model = model({properties: {foo: true, bar: true}});
    var obj = Model({foo: 'a', bar: 'b'});
    var result = obj.dehydrate();
    expect(result).to.be.an('object');
    expect(result).to.have.property('foo');
    expect(result.foo).to.equal('a');
    expect(result).to.have.property('bar');
    expect(result.bar).to.equal('b');
  });
  it('uses the schema\'s "dehydrate" transformation', function() {
    var called = false, calledWith = null;
    var Model = model({
      additionalProperties: true,
      dehydrate: function(arg) {
        calledWith = arg;
        called = true;
      }
    });
    var instance = Model({foo: 'bar'});
    instance.dehydrate();
    expect(called).to.equal(true);
    expect(calledWith).to.eql(instance);
  });
});
describe('instance.validate()', function() {
  it('returns a revalidator validation result', function() {
    var result = model({})().validate();
    expect(result).to.be.an('object');
    expect(result).to.have.property('valid');
    expect(result.valid).to.be.a('boolean');
    expect(result).to.have.property('errors');
    expect(result.errors).to.be.an('array');
  });
});

describe('model({defaults})', function() {
  it('copies defaults to new instances of the Model', function() {
    var Model = model({defaults: {foo: 'bar'}});
    var instance = new Model();
    expect(instance).to.have.property('foo', 'bar');
  });
  it('clones array default values', function() {
    var Model = model({defaults: {foo: ['bar', 'qux']}});
    var instance = new Model();
    expect(instance).to.have.property('foo');
    expect(instance.foo).to.eql(Model.schema.defaults.foo);
    expect(instance.foo).not.to.equal(Model.schema.defaults.foo);
  });
  it('clones object default values', function() {
    var Model = model({defaults: {foo: {bar: 'qux'}}});
    var instance = new Model();
    expect(instance).to.have.property('foo');
    expect(instance.foo).to.eql(Model.schema.defaults.foo);
    expect(instance.foo).not.to.equal(Model.schema.defaults.foo);
  });
  it('invokes function default values', function() {
    var Model = model({defaults: {foo: {qux: function() {return 'bar';}}}});
    var instance = new Model();
    expect(instance).to.have.property('foo');
    expect(instance.foo).to.have.property('qux', 'bar');
  });
});