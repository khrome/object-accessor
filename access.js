function field(root, name, value){
    if(typeof name == 'string') return field(root, name.split('.'), value);
    var current = root;
    var fieldName;
    while(name.length){
        fieldName = name.shift();
        if(!current[fieldName]){
            if(value) current[fieldName] = {};
            else return undefined;
        }
        if(!name.length){
            if(value) current[fieldName] = value;
            return current[fieldName];
        }else current = current[fieldName];
    }
    return undefined;
}

function objectField(obj, field, value){
    Object.defineProperty(obj, field, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
    });
}

module.exports = {
    //todo: support emitting events on a passed emitter
    augment : function(target, data, wrap){
        objectField(target, 'get', function(fieldName){
            return field(data, fieldName);
        });
        objectField(target, 'set', function(fieldName, value){
            if(wrap) item = wrap(item);
            var val = field(data, fieldName);
            var newValue = field(data, fieldName, value);
        });
        return target;
    },
    get : function(data, fieldName){
        return field(data, fieldName);
    },
    set : function(data, fieldName, value){
        return field(data, fieldName, value);
    }
}
