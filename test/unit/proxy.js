QUnit.module("Proxy tests");

QUnit.test("$.proxy()", function(assert){

    var context = "a", proximity_function = function(){
        return this;
    };
    $.proxy(proximity_function, context);
    assert.equal(proximity_function(), "a", "Test passed for $.proxy()");
});