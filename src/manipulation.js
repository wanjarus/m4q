
m4q.fn.extend({
    append: function(elements){

    },

    appendTo: function(elements){

    },

    prepend: function(elements){

    },

    prependTo: function(elements){

    },

    insertBefore: function(element){

    },

    insertAfter: function(element){

    },

    after: function(){

    },

    before: function(){

    },

    remove: function(selector){
        var i = 0, node, out = [];

        if (this.length === 0) {
            return ;
        }

        for ( ; ( node = this[ i ] ) != null; i++ ) {
            if (node.parentNode) {
                out.push(node.parentNode.removeChild(node));
            }
        }

        return selector ? out.filter(function(el){
            return matches.call(el, selector);
        }) : out;
    }
});