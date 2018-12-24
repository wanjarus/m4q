
m4q.each = function(context, callback){
    var index = 0;
    if (m4q.isArrayLike(context)) {
        [].forEach.call(context, function(el) {
            callback.apply(el, arguments);
        });
    } else {
        for(var el in context) {
            callback.apply(context[el], [el, context[el], index++]);
        }
    }

    return context;
};

m4q.fn.extend({
    each: function(callback){
        [].forEach.call(this, function(el) {
            callback.apply(el, arguments);
        });

        return this;
    }
});
