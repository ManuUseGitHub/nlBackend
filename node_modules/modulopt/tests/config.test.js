/* eslint-disable no-undef */
const { optionize , stick } = require( "../dist" );
const { sortDefiinitions , testModuloptInterraction , testModuloptReport , testModuloptThrow } = require( "./utile" );

const { MaskBuilder } = require( "../dist/MaskBuilder" );

const maskBuilder = new MaskBuilder();

test( "setting a multioption accepting something else than string" , () => {

    // TODO:  Write about the case of chimerical multioption
    const definitions = [

        // kimera case
        [ "bools" , "default" , [ "test" , "maybe" , "no" , false ] ] ,

        // numbers
        [ "someval" , 0 , [ 5 , 3.14 , 8.1 , Number.NaN ] ] ,

        // strings
        [ "greetings" , "hello worlds" , [ "hi" , "yo" , "hey" , "booh !" ] ] ,

        // miscs
        [ "blastval" , null , [ 5 , "pi" , void 0 , () => { } ] ] ,

        [ "modulopt" , { sort : "asc" } ]
    ];

    const test = optionize( {} , definitions );
    const y = definitions.length;
    const x = definitions[ 0 ][ 2 ].length;

    sortDefiinitions( definitions );

    let cpt = 0;
    for ( let i = 0; i < y; ++i ) {
        for ( let j = 0; j < x; ++j ) {
            const bit = Math.pow( 2 , cpt++ );

            const representation = maskBuilder.formatedNumberRepresentation( bit , 16 );

            const option = definitions[ i ][ 0 ];
            expect( maskBuilder.chosenFromMask( test.modulopt , representation , option ) ).toBe( definitions[ i ][ 2 ][ j ] );
        }
    }
} );

test( "can sort options in reverse thanks to modulopt config" , () => {

    // TODO:  Write about the case of chimerical multioption
    const definitions = [

        // kimera case
        [ "bools" , "default" , [ "test" , "maybe" , "no" , false ] ] ,

        // numbers
        [ "someval" , 0 , [ 5 , 3.14 , 8.1 , Number.NaN ] ] ,

        // strings
        [ "greetings" , "hello worlds" , [ "hi" , "yo" , "hey" , "booh !" ] ] ,

        // miscs
        [ "blastval" , null , [ 5 , "pi" , void 0 , () => { } ] ] ,

        [ "modulopt" , { sort : "dsc" } ]
    ];

    const onlyOptionNames = [ "bools" , "someval" , "greetings" , "blastval" ].sort().reverse();

    const test = optionize( {} , definitions );

    Object.keys( test.options ).forEach( ( e , i ) => {
        expect( e ).toBe( onlyOptionNames[ i ] );
    } );
} );

test( "keep options order thanks to modulopt config" , () => {

    // TODO:  Write about the case of chimerical multioption
    const definitions = [

        // kimera case
        [ "bools" , "default" , [ "test" , "maybe" , "no" , false ] ] ,

        // numbers
        [ "someval" , 0 , [ 5 , 3.14 , 8.1 , Number.NaN ] ] ,

        // strings
        [ "greetings" , "hello worlds" , [ "hi" , "yo" , "hey" , "booh !" ] ] ,

        // miscs
        [ "blastval" , null , [ 5 , "pi" , void 0 , () => { } ] ] ,

        [ "modulopt" , { sort : "no" } ]
    ];

    const onlyOptionNames = [ "bools" , "someval" , "greetings" , "blastval" ];

    const test = optionize( {} , definitions );

    Object.keys( test.options ).forEach( ( e , i ) => {
        expect( e ).toBe( onlyOptionNames[ i ] );
    } );
} );

test( "can throw on mismatching option thanks to config" , () => {

    // TODO:  Write about the case of chimerical multioption
    const definitions = [

        // kimera case
        [ "existing" , {} ] ,
        [ "modulopt" , { "mismatch" : "throw" } ]

    ];

    const test = optionize( {} , definitions );

    const t = () => {
        stick( test , { un : true } );
    };

    expect( t ).toThrow( expect.stringMatching( /MODULOPT EXCEPTION c404\. Non existing option/ ) );
} );

test( "Set option should be part of propositions for multichoices" , () => {
    t = () => {
        const definitions = [

            // kimera case
            [ "existing" , {} ] ,
            [ "sort" , "no" , [ "asc" , "dsc" ] ] ,
            [ "modulopt" , { misspelled : "throw" } ]

        ];

        const test = optionize( {} , definitions );
        stick( test , { sort : "decroissant" } );
    };

    expect( t ).toThrow( expect.stringMatching( /MODULOPT EXCEPTION c400\. Invalid proposition \[decroissant\] for \[sort\] option on/ ) );
} );

test( "can prevent or allow affectation thanks to configuration" , () => {
    const regex = /MODULOPT (REPORT )?[A-Z]+ c400\. Invalid free/;
    const moodifiedOption = { freeOpt : "hello" };

    // prevent
    let test = testModuloptInterraction( regex , moodifiedOption , "mysterious" , [ "mysteriousAffect" , false ] );
    expect( test.options.freeOpt ).not.toBe( "hello" );

    // allow
    test = testModuloptInterraction( regex , moodifiedOption , "mysterious" , [ "mysteriousAffect" , true ] );
    expect( test.options.freeOpt ).toBe( "hello" );
} );

test( "mysterious option can be thrown communicated or reported" , () => {

    const regex = /MODULOPT (REPORT )?[A-Z]+ c400\. Invalid free/;
    const moodifiedOption = { freeOpt : "hello" };

    testModuloptThrow( regex , moodifiedOption , [ "mysterious" , "throw" ] );
    testModuloptReport( regex , moodifiedOption , [ "mysterious" , "report" ] );
    testModuloptInterraction( regex , moodifiedOption , "mysterious" );
} );

test( "not matching propositions for multichoices can be thrown communicated or reported" , () => {

    const regex = /MODULOPT (REPORT )?[A-Z]+ c400\. Invalid proposition \[absolutely\] for \[existing\] option on/;
    const moodifiedOption = { existing : "absolutely" };

    testModuloptThrow( regex , moodifiedOption , [ "misspelled" , "throw" ] );
    testModuloptReport( regex , moodifiedOption , [ "misspelled" , "report" ] );
    testModuloptInterraction( regex , moodifiedOption , "misspelled" );
} );

test( "not matching option can be thrown communicated or reported" , () => {

    const regex = /MODULOPT (REPORT )?[A-Z]+ c404\. Non existing option/;
    const moodifiedOption = { unexisting : true };

    testModuloptThrow( regex , moodifiedOption , [ "mismatch" , "throw" ] );
    testModuloptReport( regex , moodifiedOption , [ "mismatch" , "report" ] );
    testModuloptInterraction( regex , moodifiedOption , "mismatch" );
} );