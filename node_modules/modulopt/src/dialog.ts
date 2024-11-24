import {
	NOT_FOUND_CODE ,
	BAD_REQUEST ,
	DEFAULT_MOPT_CONFIG ,
	VMI ,
} from "./moptConstants";
import {
	IFailingCheck ,
	ILoggingMessage ,
	IOptions ,
	IUseOptions ,
} from "./interfaces";

const dateNTime = require( "date-and-time" );

const hintDefinitions = ( object: IUseOptions , hint: boolean ) => {
	if ( hint ) {
		const stringify = require( "json-stringify-pretty-compact" );
		const colorizeJson = require( "json-colorizer" );

		console.log(
			`modulopt configuration for the instance of "${object.constructor.name}" (class) :\n` ,
			colorizeJson( stringify( object.modulopt ) )
		);
	}

	return object;
};

const getNowString = ( date: Date , format = "hh:mm A [GMT]Z" ) => {
	return dateNTime.format( date , format );
};

const checkValidCall = ( check: IFailingCheck ): void => {
	const { data , kind } = check;
	const config =
		data.modulopt.config !== undefined
			? data.modulopt.config
			: DEFAULT_MOPT_CONFIG;
	const moduloptConfig = config.options;

	let verb = "UNKNOWN";
	switch ( kind ) {
		case "options" :
			verb = moduloptConfig.mismatch;
			break;
		case "propositions" :
			verb = moduloptConfig.misspelled;
			break;
		case "free" :
			verb = moduloptConfig.mysterious;
			break;
		default :
			throw "MODULOPT EXCEPTION c400. Unknown interraction kind. Specify either options, propositions or free";
	}

	const message = constructMessage( check , verb );

	interactOnVerb( check , verb , message );
};

const interactOnVerb = (
	check: IFailingCheck ,
	verb: string ,
	message: string
) => {
	if ( verb === "throw" ) {
		throw message;
	} else if ( verb !== "ignore" && verb !== "report" ) {
		( console as any )[ VMI[ verb ].interaction ]( message );
	} else if ( verb === "report" ) {
		onShouldReport( check , message );
	}
};

const constructMessage = ( check: IFailingCheck , verb: string ): string => {
	const { data , key , kind , value } = check;

	let messageParts: string[] = [ "MODULOPT UKNOWN" ];

	const singularKind = kind.replace( /s$/g , "" );
	messageParts.push(
		kind == "options"
			? `c${NOT_FOUND_CODE}. Non existing ${singularKind} [${key}] on`
			: kind == "propositions"
			? `c${BAD_REQUEST}. Invalid ${singularKind} [${value}] for [${key}] option on`
			: `c${BAD_REQUEST}. Invalid ${singularKind} value [${value}] for the ${singularKind} [${key}] option on`
	);
	messageParts.push( `[${data.constructor.name}] object` );

	if ( verb === "throw" ) {
		messageParts[ 0 ] = "MODULOPT EXCEPTION";
	} else if ( verb !== "ignore" && verb !== "report" ) {
		messageParts[ 0 ] = `MODULOPT ${VMI[ verb ].type}`;
	} else if ( verb === "report" ) {
		messageParts[ 0 ] = "MODULOPT REPORT MISMATCH";
		messageParts = [ `[${getNowString( new Date() )}]` ].concat( messageParts );
	}
	return messageParts.join( " " );
};

const onShouldReport = ( check: IFailingCheck , message: string ) => {
	const time = new Date();

	const log: ILoggingMessage = {
		timestamp : time.getTime() ,
		message : message ,

		// so you can get the stacktrace
		exception : new Error( message ) ,

		// the code is get from the message. It is formated la this (with a dot at the end) : cXXX.
		code : parseInt( /c([\d]+)\./.exec( message )![ 1 ] ) ,

		// can help figuring the error out
		changes : [
			"These changes lead to the orror:" ,
			check.data.options[ check.key ] ,
			">>>>>" ,
			check.value ,
		] ,
	};

	check.data.modulopt.logs.push( log );
};

export { hintDefinitions , checkValidCall };
