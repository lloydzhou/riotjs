var models = {}, guid = function(){return Math.random().toString(36).substring(2, 15)}
$.model = function(attr, parent) {
    // create new object: obj = $.model(name, data)
    // define one class: class = $.model(attr, parent)
    if (typeof attr == 'string') 
        return models[attr] ? new models[attr](parent) : {}
    var pobj = typeof parent == "function" ? new parent() : 
        typeof parent == 'string' && $.model(parent)
    return models[attr.name || guid()] = function(data) {
        $.extend(this, pobj, attr, data)
        if (!(this.on && this.off && this.trigger && this.one)) $.observable(this)
        this.name = attr.name || this.name || arguments.callee.name || 'base'
        this[this.name+'Init'] && this[this.name+'Init'](this)
    }
} 
