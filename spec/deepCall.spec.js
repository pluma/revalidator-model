/*global describe, it */
var expect = require('expect.js'),
  deepCall = require('../').deepCall;

describe('deepCall(obj)', function() {
  it('is a function', function() {
    expect(deepCall).to.be.a('function');
  });
  it('returns the input object', function() {
    var obj = {};
    expect(deepCall(obj)).to.equal(obj);
  });
  it('replaces functions on the object with their return values', function() {
    var obj = {
      y: function() {return 1;},
      z: function() {return 2;}
    };
    deepCall(obj);
    expect(obj).to.have.property('y', 1);
    expect(obj).to.have.property('z', 2);
  });
  it('leaves other values alone', function() {
    var obj = {x: {y: {z: 5, a: null, b: undefined}}};
    deepCall(obj);
    expect(obj).to.eql({x: {y: {z: 5, a: null, b: undefined}}});
  });
  it('traverses nested properties', function() {
    var obj = {x: {y: {z: function() {return 13;}}}};
    deepCall(obj);
    expect(obj).to.have.property('x');
    expect(obj.x).to.have.property('y');
    expect(obj.x.y).to.have.property('z', 13);
  });
});