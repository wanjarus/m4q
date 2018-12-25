
m4q.extend({
    proxy: function(fn, context){
        fn.bind(context);
    }
});
