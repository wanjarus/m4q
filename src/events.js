
m4q.fn.extend({
    on: function(event, selector, handler){
        if (this.length === 0) {
            return;
        }
        if (typeof selector === "function") {
            handler = selector;
            this.items().forEach(function(el){
                el.addEventListener(event, handler);
            });
        } else {
            this.find(selector).on(event, handler);
        }

        return this;
    },

    off: function(event, selector){
        if (this.length === 0) {
            return;
        }
        if (selector === undefined) {
            this[0].removeEventListener(event);
        } else {
            this.find(selector).off(event);
        }

        return this;
    },

    trigger: function(name, data){
        var e;
        if (this.length === 0) {
            return ;
        }
        e = new CustomEvent(name, data || {});
        this.items().forEach(function(el){
            el.dispatchEvent(e);
        });
        return this;
    }
});

( "blur focus resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu" )
    .split( " " )
    .forEach(
    function( name ) {
        m4q.fn[ name ] = function( data, fn ) {
            return arguments.length > 0 ?
                this.on( name, data, fn ) :
                this.trigger( name );
        };
});

m4q.fn.extend( {
    hover: function( fnOver, fnOut ) {
        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    }
});

m4q.ready = function(fn){
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
