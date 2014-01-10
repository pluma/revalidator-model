/*global describe, it */
var expect = require('expect.js'),
  model = require('../');

describe('model(schema)', function() {
  it('is a function', function() {
    expect(model).to.be.a('function');
  });
  it('returns a Model constructor', function() {
    var Ctor = model({});
    expect(Ctor).to.be.a('function');
    expect(Ctor).to.have.property('prototype');
    expect(Ctor.prototype).to.be.an('object');
  });
  it('exposes the schema', function() {
    var schema = {};
    var Model = model(schema);
    expect(Model.prototype).to.have.property('schema');
    expect(Model.prototype.schema).to.equal(schema);
  });
  it('extends schema.proto', function() {
    var schema = {proto: {}};
    var proto = model(schema).prototype;
    expect(Object.getPrototypeOf(proto)).to.equal(schema.proto);
  });
});

describe('Model.hydrate(data)', function() {
  it('is a method', function() {
    var Model = model({});
    expect(Model).to.have.property('hydrate');
    expect(Model.hydrate).to.be.a('function');
  });
  it('returns a Model instance', function() {
    var Model = model({});
    var obj = Model.hydrate({});
    expect(obj).to.be.a(Model);
    expect(Object.getPrototypeOf(obj)).to.equal(Model.prototype);
  });
  it('uses the schema\'s "hydrate" transformation', function() {
    var called = false, calledWith = null;
    var Model = model({
      hydrate: function(arg) {
        calledWith = arg;
        called = true;
      }
    });
    var data = {};
    Model.hydrate(data);
    expect(called).to.equal(true);
    expect(calledWith).to.equal(data);
  });
});

describe('new Model(data)', function() {
  var Model = model({properties: {foo: true, bar: true}});
  it('returns a Model instance', function() {
    var obj = Model({});
    expect(obj).to.be.a(Model);
    expect(Object.getPrototypeOf(obj)).to.equal(Model.prototype);
  });
  it('copies matching attributes', function() {
    var obj = Model({foo: 'a', bar: 'b'});
    expect(obj).to.have.property('data');
    expect(obj.data).to.have.property('foo');
    expect(obj.data.foo).to.equal('a');
    expect(obj.data).to.have.property('bar');
    expect(obj.data.bar).to.equal('b');
  });
  it('does not simply copy the data object', function() {
    var data = {};
    var obj = Model(data);
    expect(obj.data).to.not.equal(data);
  });
  it('ignores unknown attributes', function() {
    var obj = Model({bar: 'b', qux: 'c'});
    expect(obj).to.have.property('data');
    expect(obj.data).to.have.property('bar');
    expect(obj.data.bar).to.equal('b');
    expect(obj.data).to.not.have.property('qux');
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
      dehydrate: function(arg) {
        calledWith = arg;
        called = true;
      }
    });
    var instance = Model({});
    instance.dehydrate();
    expect(called).to.equal(true);
    expect(calledWith).to.equal(instance.data);
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