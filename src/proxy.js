
m4q.extend({
    proxy: function(fn, context){
        if (typeof fn !== "function") {
            return ;
        }
        console.log(context);
        fn.bind(context);
    }
});
