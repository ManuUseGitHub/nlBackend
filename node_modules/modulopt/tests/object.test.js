/* eslint-disable no-undef */
const { stick } = require( "../dist" );
const { getInstanceConfigured } = require( "./utile" );

test( "can set an option with object" , () => {
    const obj = getInstanceConfigured();

    [ "normal" , "intermediate" , "hard" ].forEach( level => {
        const updated = stick( obj , { level : level } );
        expect( updated.options[ "level" ] ).toBe( level );
    } );
} );

test( "Once set, the option is different than the default" , () => {
    const obj = getInstanceConfigured();

    [ "normal" , "intermediate" , "hard" ].forEach( level => {
        const updated = stick( obj , { level : level } );
        expect( updated.options[ "level" ] ).toBe( level );
    } );
} );

test( "Set option can only be one listed" , () => {
    const obj = getInstanceConfigured();

    [ "medium" , "rare" , "coocked" ].forEach( level => {
        const updated = stick( obj , { level : level } );
        expect( updated.options[ "level" ] ).toBe( obj.modulopt.defaults.level );
    } );
} );