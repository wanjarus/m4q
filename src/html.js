
m4q.fn.extend({
    html: function(value){
        return this._property('innerHTML', value);
    },

    outerHTML: function(){
        return this._property('outerHTML');
    },

    text: function(value){
        return this._property('textContent', value);
    },

    innerText: function(value){
        return this._property('innerText', value);
    }
});

