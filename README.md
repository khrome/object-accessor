object-accessor
===============

a simple module to add a get/set to an object that is bound to an arbitrary data object and request deep items from it (`something.someotherthing.somedeepthing`), or alternatively fetch deep items directly through a data object

```js
    var access = require('object-accessor');
    var data = { /* some data here*/ };
    var object = access.augment({}, data);
    object.get('somefield.subfield');
    object.set('toplevelfield', 'some value');
    //or
    access.get(data, 'somefield.subfield');
    access.set(data, 'toplevelfield', 'some value');

    access.getAll(data, 'someList.*.subfield');
    access.setAll(data, 'someList.*.subfield', 'some value');

```
