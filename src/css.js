
m4q.fn.extend({
    css: function(o, v){
        var win;

        if (this.length === 0) {
            return ;
        }

        if (typeof o === "string" && v === undefined) {
            win = this[0].ownerDocument.defaultView;
            return  this[0].style[o] ?  this[0].style[o] : win.getComputedStyle(this[0], null)[o];
        }

        this.each(function(el){
            if (typeof o === "object") {
                for (var key in o) {
                    el.style[key] = o[key];
                }
            } else if (typeof o === "string") {
                el.style[o] = v;
            }
        });

        return this;
    },

    addClass: function(){},
    removeClass: function(){},
    toggleClass: function(){},
    containsClass: function(){},

    clearClasses: function(){
        return this.each(function(){
            this.className = "";
        });
    }
});

['add', 'remove', 'toggle', 'contains'].forEach(function (method) {
    m4q.fn[method + "Class"] = function(cls){
        this.each(function(el){
            el.classList[method](cls);
        });

        return this;
    }
});
