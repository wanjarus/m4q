QUnit.module("Attributes");

QUnit.test("attr()", function(assert){
    assert.equal($("body").attr(), undefined, "Test passed for attr() with no argument");
    assert.equal($("body").attr(null), undefined, "Test passed for attr( null ) with no argument");
    assert.equal($("body").attr(undefined), undefined, "Test passed for attr( undefined ) with no argument");
    assert.equal($("body").attr("fake"), undefined, "Test passed for non existing attr( 'fake' ) ");

    document.body.setAttribute("data-test", "test-value");
    assert.equal($("body").attr("data-test"), $(document.body).attr("data-test"), "Test passed for gets attribute $('body').attr() === $(document.body).attr()");

    assert.equal($("body").attr("data-test", "test-value").attr("data-test"), "test-value", "Test passed for set/get attribute");
});