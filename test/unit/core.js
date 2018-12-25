QUnit.module("Core");

QUnit.test("Populating", function(assert){
    assert.ok(m4q, "m4q present");
    assert.ok($M, "$M present");
    assert.ok($, "$ present");
});

QUnit.test("Query", function(assert){
    var elem;

    assert.equal($().length, 0, "Length must be zero if no arguments $( )");
    assert.equal($(undefined).length, 0, "Length must be zero if undefined $( undefined )");
    assert.equal($(null).length, 0, "Length must be zero if null $( null )");
    assert.equal($("").length, 0, "Length must be zero if empty string $( '' )");

    try {
        $("#");
    } catch ( e ) {
        assert.ok( true, "Threw an error on #id with no id" );
    }

    try {
        $(".");
    } catch ( e ) {
        assert.ok( true, "Threw an error on .class with no class" );
    }

    assert.equal( $( window ).length, 1, "Correct number of elements generated for $( window )" );
    assert.equal( $( document ).length, 1, "Correct number of elements generated for $( document )" );
    assert.equal( $( document.body ).length, 1, "Correct number of elements generated for $( document.body )" );
    assert.ok( $( "<div>" ) instanceof m4q, "Test passed for $( '<div>' ) instanceof m4q object" );
    // assert.equal( $( document.body ).get( 0 ), $( "body" ).get( 0 ), "Test passing an html node to the factory" );
    // assert.equal( $( "<div>" ).get( 0 ).outerHTML, $( "<div>" ).get( 0 ).outerHTML, "Test passing an html node to the factory" );

    assert.equal( $("<div>").length, 1, "Correct number of elements generated for $('<div>')" );
    assert.equal( $("<div>", {
        id: "div-elem-1"
    }).attr("id"), "div-elem-1", "Correct set attributes for $('<div>', {id: 'div-elem-1'})" );

    elem = $( "  <em>hello</em>" )[ 0 ];
    assert.equal( elem.nodeName.toLowerCase(), "em", "Leading space" );

    elem = $( "\n\n<em>world</em>" )[ 0 ];
    assert.equal( elem.nodeName.toLowerCase(), "em", "Leading newlines" );
});