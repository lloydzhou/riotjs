
$.model({
    name: 'rest',
    target: '#content',
    restInit: function(self){
        var e = new Base64(sessionStorage.getItem('__k')||(function (){
            var _k = new Array(16).join('10').split('').sort(function (){
                return 0.5 - Math.random();
            }).join('')
            sessionStorage.setItem('__k', _k)
            return _k
        })()), tpls = [];
        self.server = {
            _: function(data, cb, type, db, coll){
                var urls = [this.api || '', db||this.db, coll||this.coll]
                self.trigger('call', data, cb, type, db, coll))
                $.ajax({
                    url: urls.join('/') + (type == 'DELETE' ? '?' + $.param(data) : ''),
                    type: type || 'GET', data: data,
                    success: function(json){
                        cb(json)
                        self.trigger('end', json)
                    },
                    error: function(){
                        self.trigger('error')
                    }
                })        
            },
            find: function(criteria, cb){
                self.server._({criteria: JSON.stringify(criteria)}, cb)
            }, 
            list: function(criteria, skip, limit, cb){
                self.server._({criteria: JSON.stringify(criteria), skip: skip, 
                    limit: limit, batch_size: limit}, cb)
            },
            insert: function(docs, cb){
                self.server._({docs: JSON.stringify(docs)}, cb, 'PUT')
            }, 
            update: function(criteria, newobj, cb){
                self.server._({criteria: JSON.stringify(criteria), 
                    newobj: JSON.stringify(newobj)}, cb, 'PUT')
            }, 
            remove: function(criteria, cb){
                self.server._({criteria: JSON.stringify(criteria)}, cb, 'DELETE')
            }
        }
        self.user = function(u){
            if (u) 
                return sessionStorage.setItem('__u', e.encode(JSON.stringify(u)))
            return JSON.parse(e.decode(sessionStorage.getItem('__u') || e.encode('null')))
        }
        self.route = function(path){
            window.location.hash = path ? '!' + path : window.location.hash
            window.location.reload()
        }
        self.tpl = function(tname){
            tname = tname || self.name
            return tpls[tname] = tpls[tname] || $('#tpl-' + tname).html()
        }
        self.format = function (data){
            if (data && data.$oid) return data.$oid
            if (data && data.$date) return {str: (new Date(data.$date)+ '').substr(0, 25), $date: data.$date}
            if ("object" == typeof data) {
                for (var i in data)
                    data[i] = this.format(data[i])
                    return data;
            }
            return data
        }
        self.renderl = function(root, t, data, o){
            o = o || {}
            root.html('')
            $.each(data, function(i, n){
                var item = $($.render(self.tpl(t), o.format && o.format(n) || self.format(n), o.ef))
                root.append(item)
                self.trigger(o.ievent || 'item', item, n)
            })
            self.trigger(o.event || 'list', root, data) 
        }
        self.render = function(root, t, data, o){
            o = o || {}
            self.trigger(o.event || 'view', root.html('')
                .html($.render(self.tpl(t), o.format && o.format(n) || self.format(data)), o.ef), data)
        }

        if (typeof self.auth == "function" && ! self.auth(self.user())
            self.route(self.loginurl || 'login')
        self.trigger('init')

        self.run = function(name){
            var args = [].slice.call(arguments, 1)
            self[name] && self[name](args) 
            self.trigger(name, args)
            self.trigger('run')
        }
    }
})

