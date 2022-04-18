var should = require("chai").should();
var copy = function(ob){ return JSON.parse(JSON.stringify(ob))};
var access = require('./access');
var testObject = {
    something : 'somevalue',
    parentthing : {
        subthing : 'subvalue',
        subparent : {
            subthing : 'subsubvalue'
        }
    }
};

var testObjectWithArray = {
    something : 'somevalue',
    parentlist : [
        {
            subthing : 'subvalue',
            subparent : {
                subthing : 'subsubvalue'
            }
        },
        {
            subthing : 'alternatevalue',
            subparent : {
                subthing : 'differentsubsubvalue'
            }
        }
    ]
};
var createAugmentedObject = function(){
    var object = {};
    var data = copy(testObject);
    access.augment(object, data);
    return object;
}

describe('object-access', function(){
    describe('augments an object', function(){
        it('with attached functions', function(){
            var object = createAugmentedObject();
            should.exist(object.get);
            should.exist(object.set);
        });

        it('gets a value', function(){
            var object = createAugmentedObject();
            var value = object.get('something');
            should.exist(value);
            value.should.equal('somevalue');
        });

        it('sets a value', function(){
            var object = createAugmentedObject();
            object.set('something', 'someothervalue');
            var value = object.get('something');
            should.exist(value);
            value.should.equal('someothervalue');
        });

        it('gets a subvalue', function(){
            var object = createAugmentedObject();
            var value = object.get('parentthing.subthing');
            should.exist(value);
            value.should.equal('subvalue');
        });

        it('sets a subvalue', function(){
            var object = createAugmentedObject();
            object.set('parentthing.subthing', 'someothervalue');
            var value = object.get('parentthing.subthing');
            should.exist(value);
            value.should.equal('someothervalue');
        });

        it('gets a deep value', function(){
            var object = createAugmentedObject();
            var value = object.get('parentthing.subparent.subthing');
            should.exist(value);
            value.should.equal('subsubvalue');
        });

        it('sets a deep value', function(){
            var object = createAugmentedObject();
            object.set('parentthing.subparent.subthing', 'someothervalue');
            var value = object.get('parentthing.subparent.subthing');
            should.exist(value);
            value.should.equal('someothervalue');
        });

    });

    describe('accesses through an object', function(){
        it('gets a value', function(){
            var data = copy(testObject);
            var value = access.get(data, 'something');
            should.exist(value);
            value.should.equal('somevalue');
        });

        it('sets a value', function(){
            var data = copy(testObject);
            access.set(data, 'something', 'someothervalue');
            var value = access.get(data, 'something');
            should.exist(value);
            value.should.equal('someothervalue');
        });

        it('gets a subvalue', function(){
            var data = copy(testObject);
            var value = access.get(data, 'parentthing.subthing');
            should.exist(value);
            value.should.equal('subvalue');
        });

        it('sets a subvalue', function(){
            var data = copy(testObject);
            access.set(data, 'parentthing.subthing', 'someothervalue');
            var value = access.get(data, 'parentthing.subthing');
            should.exist(value);
            value.should.equal('someothervalue');
        });

        it('gets a deep value', function(){
            var data = copy(testObject);
            var value = access.get(data, 'parentthing.subparent.subthing');
            should.exist(value);
            value.should.equal('subsubvalue');
        });

        it('sets a deep value', function(){
            var data = copy(testObject);
            access.set(data, 'parentthing.subparent.subthing', 'someothervalue');
            var value = access.get(data, 'parentthing.subparent.subthing');
            should.exist(value);
            value.should.equal('someothervalue');
        });
    });

    describe('uses wildcard access to pull groups', function(){
        it('gets a set of subthings through an array', function(){
            var data = copy(testObjectWithArray);
            var values = access.getAll(data, 'parentlist.*.subthing');

            should.exist(values.length);
            values.length.should.equal(2);

            should.exist(values[0]);
            should.exist(values[0].value);
            values[0].value.should.equal('subvalue');
            should.exist(values[0].path);
            values[0].path.should.equal('parentlist.0.subthing');

            should.exist(values[1]);
            should.exist(values[1].value);
            values[1].value.should.equal('alternatevalue');
            should.exist(values[1].path);
            values[1].path.should.equal('parentlist.1.subthing');
        });
    });

    describe('handles nonexistence', function(){
        it('fails to set a nonexistent path', function(){
            var data = copy(testObject);
            access.set(data, 'parentthing.notathing.subnot', 'someothervalue');
        });

        it('sets a nonexistent path when prompted', function(){
            var data = copy(testObject);
            access.set(data, 'parentthing.notathing.subnot', 'someothervalue');
        });
    });
});
