/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const { optionize , stick } = require( "../dist" );

class Testing {
    hello = "world";
}

const vmi = {
    inform : { interaction : "info" , type : "INFO" } ,
    yell : { interaction : "error" , type : "ERROR" } ,
    warn : { interaction : "warn" , type : "WARNING" } ,
    debug : { interaction : "log" , type : "DEBUG" } ,
};

const getInstanceConfigured = ( hint = false ) => {
    const tt = new Testing();
    optionize( tt , [
        [ "displays" , false ] ,
        [ "bar" , false ] ,
        [ "level" , "none" , [ "normal" , "intermediate" , "hard" ] ] ,
        [ "foo" , true ] ,
        [ "sort" , "no" , [ "asc" , "dsc" ] ] ,
        [ "obj" ] ,
        [ "numbs" , 10 ] ,
        [ "numba" , 0 ] ,
        [ "modulopt" ,
            { mismatch : "throw" , sort : "asc" }
        ]
    ] , hint );
    return Object.assign( {} , tt );
};

const removeFromOptions = ( obj , options ) => {
    Object.keys( obj.modulopt.defaults ).forEach( key => {
        const _default = obj.modulopt.defaults[ key ];

        if ( typeof _default !== "boolean" ) {
            delete options[ key ];
        }
    } );
};

const sortDefiinitions = ( definitions , direction = "asc" ) => {

    if ( direction !== "no" ) {
        const dirInfluence = direction === "asc" ? 1 : -1;
        definitions.sort( ( a , b ) => {
            if ( a[ 0 ] < b[ 0 ] ) {
                return -1 * dirInfluence;
            }
            if ( a[ 0 ] > b[ 0 ] ) {
                return 1 * dirInfluence;
            }
            return 0;
        }
        );
    }
};


const testModuloptThrow = ( regex , modifiedOptions , ...moduloptOptionNamesAndValues ) => {
    const moptOptions = {};
    
    moduloptOptionNamesAndValues.forEach( ( nameAndValue )=> {
        moptOptions[ nameAndValue[ 0 ] ] = nameAndValue[ 1 ];
    }  );

    const t = () => {
        const definitions = [

            // kimera case
            [ "existing" , "maybe" , [ "not sure" , "certainly" ] ] ,
            [ "freeOpt" , { a : 1 , b : 2 , c : 3 , d : "test" } ] ,
            [ "modulopt" , moptOptions ]
        ];

        const optionized = optionize( {} , definitions );
        stick( optionized , modifiedOptions );
    };

    expect( t ).toThrow( expect.stringMatching( regex ) );
};
const testModuloptInterraction = ( regex , modifiedOptions , moduloptOptionName , ...moduloptOptionNamesAndValues ) => {

    const withOption = ( k ) => {
        const option = {};
        option[ moduloptOptionName ] = k;
        return option;
    };

    let test = {};

    const moptOptions = {};
    
    moduloptOptionNamesAndValues.forEach( ( nameAndValue )=> {
        moptOptions[ nameAndValue[ 0 ] ] = nameAndValue[ 1 ];
    }  );

    Object.keys( vmi ).forEach( k => {

        const e = vmi[ k ];
        const definitions = [

            // kimera case
            [ "existing" , "maybe" , [ "not sure" , "certainly" ] ] ,
            [ "freeOpt" , {} ] ,
            [ "modulopt" , Object.assign( withOption( k ) , moptOptions ) ]
        ];

        test = optionize( {} , definitions );
        console[ e.interaction ] = jest.fn();
        stick( test , modifiedOptions );

        expect( console[ e.interaction ] ).toHaveBeenCalledWith( expect.stringMatching( regex ) );
    } );

    return test;
};

const testModuloptReport = ( regex , modifiedOptions , ...moduloptOptionNamesAndValues ) => {
    const moptOptions = {};
    
    moduloptOptionNamesAndValues.forEach( ( nameAndValue )=> {
        moptOptions[ nameAndValue[ 0 ] ] = nameAndValue[ 1 ];
    }  );

    const definitions = [

        // kimera case
        [ "existing" , "maybe" , [ "not sure" , "certainly" ] ] ,
        [ "freeOpt" , { a : 1 , b : 2 , c : 3 , d : "test" } ] ,
        [ "modulopt" , moptOptions ]
    ];

    const obj = optionize( {} , definitions );
    stick( obj , modifiedOptions );
    let foundMessage = "";
    
    obj.modulopt.logs.forEach( e => {
        if ( /MODULOPT REPORT MISMATCH c/.test( e.message ) ) {
            foundMessage = e.message;
        }
    } );

    expect( foundMessage ).toStrictEqual( expect.stringMatching( regex ) );
    return test;
};

// eslint-disable-next-line no-undef
module.exports = {
    getInstanceConfigured ,
    removeFromOptions , 
    Testing , 
    sortDefiinitions ,
    vmi , 
    testModuloptInterraction , 
    testModuloptReport , 
    testModuloptThrow
};
