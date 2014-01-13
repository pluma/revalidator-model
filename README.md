# Synopsis

**revalidator-model** is a simple model library based on [revalidator](https://github.com/flatiron/revalidator).

[![Build Status](https://travis-ci.org/pluma/revalidator-model.png?branch=master)](https://travis-ci.org/pluma/revalidator-model) [![Coverage Status](https://coveralls.io/repos/pluma/revalidator-model/badge.png?branch=master)](https://coveralls.io/r/pluma/revalidator-model?branch=master) [![NPM version](https://badge.fury.io/js/revalidator-model.png)](http://badge.fury.io/js/revalidator-model) [![Dependencies](https://david-dm.org/pluma/revalidator-model.png)](https://david-dm.org/pluma/revalidator-model)

# Install

## With NPM

```sh
npm install revalidator-model
```

## From source

```sh
git clone https://github.com/pluma/revalidator-model.git
cd revalidator-model
npm install
make test
```

# Usage Example

```javascript
var model = require('revalidator-model');
var List = model({
    properties: {
        items: {type: 'array'}
    },
    proto: {
        size: function() {
            return this.data.items.length;
        }
    },
    defaults: {
        flavor: 'pungent'
    },
    hydrate: {
        items: function(val) {
            return val.split(', ');
        }
    },
    dehydrate: {
        items: function(val) {
            return val.join(', ');
        }
    }
});
var list = List.hydrate({items: 'foo, bar, qux', foo: 'bar'});
console.log(list.data.items); // ['foo', 'bar', 'qux']
console.log(list.size()); // 3
console.log(list.data.flavor); // 'pungent'
console.log(list.dehydrate()); // {items: 'foo, bar, qux'}
console.log(list.validate()); // {valid: true, errors: []}
var list2 = new List({items: 5, flavor: 'spicy'});
console.log(list.data.flavor); // 'spicy';
console.log(list.data.items); // 5
console.log(list2.validate().valid); // false
```

# API

## model(schema:Object):Model

Creates a `Model` with the given revalidator `schema`.

In addition to the properties recognized by `revalidator` (`properties`, `patternProperties`, `additionalProperties`), the `schema` can have the following properties:

### schema.proto:Object (optional)

The `prototype` instances of the `Model` should inherit from. Use this to specify methods you want to have access to on your model's instances.

### schema.defaults:Object (optional)

Default property values to be copied to the `data` attribute of new instances of this `Model`.

### schema.hydrate:Function (optional)

A [transformation](https://github.com/pluma/transform-object) that will be applied to objects processed by your model's `hydrate` method.

### schema.dehydrate:Function (optional)

A [transformation](https://github.com/pluma/transform-object) that will be applied to model instances' `data` when processed by their `dehydrate` method.

## new Model(data:Object):Instance

Creates a new instance with the given `data`. Use of the `new` keyword is optional.

Any properties of the given `data` object that are not recognized will be ignored.

## Model.hydrate(data:Object):Instance

See `schema.hydrate`. Hydrates the object from the given `data` and returns a new `Model` instance.

## Model#dehydrate():Object

See `schema.dehydrate`. Dehydrates the instance's `data` and returns it.

## Model#validate():Object

Validates the instance's data using `revalidator`. The result object has two attributes:

### valid:Boolean

Whether the instance's data passed validation.

### errors:Array

An array of error messages if the validation failed.

## Model#schema:Object

The `schema` that was passed used to create the `Model` of this instance.

## Model#data:Object

The instance's `data`.

# Unlicense

This is free and unencumbered public domain software. For more information, see http://unlicense.org/ or the accompanying [UNLICENSE](https://github.com/pluma/revalidator-model/blob/master/UNLICENSE) file.