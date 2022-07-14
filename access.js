function field(root, name, value, force){
    if(typeof name === 'string') return field(root, name.split('.'), value, force);
    var current = root;
    var fieldName;
    while(name.length){
        fieldName = name.shift();
        if(!current[fieldName]){
            if(value) current[fieldName] = {};
            else return undefined;
        }
        if(!name.length){
            if(value || force) current[fieldName] = value;
            return current[fieldName];
        }else current = current[fieldName];
    }
    return undefined;
}

function allFields(root, name, value, force, parents){
    if(typeof name === 'string') return allFields(root, name.split('.'), value, force, []);
    var current = root;
    var fieldName;
    while(name.length){
        fieldName = name.shift();
        if(fieldName === '*' ){
            let results = Object.keys(current)
                .reduce((res, k) => {
                    let p = clone(parents);
                    p.push(k);
                    let items = allFields(current[k], clone(name), value, force, p).map((item)=>{
                        item.path = p.join('.');
                        return item;
                    });
                    return res.concat(items);
                }, [])
            return results;
        }
        parents.push(fieldName);
        if(!current[fieldName]){
            if(value) current[fieldName] = {};
            else return undefined;
        }
        if(!name.length){
            // console.log('!', current, fieldName)
            if(value) current[fieldName] = value;
            let res = current[fieldName]?[{
                value: current[fieldName]
            }]:current[fieldName];
            return res;
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

var clone = function(ob){ return JSON.parse(JSON.stringify(ob))};

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
    set : function(data, fieldName, value, force){
        return field(data, fieldName, value, force);
    },
    getAll : function(data, fieldName){
        return allFields(data, fieldName);
    },
    setAll : function(data, fieldName, value, force){
        return allFields(data, fieldName, value, force);
    }
}
