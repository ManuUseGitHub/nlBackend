import { stickOptions } from "./apply";
import { hintDefinitions } from "./dialog";
import {
	IUseOptions ,
	IBuild ,
	IRowsOption ,
	IBeforeOptionizeObject ,
	IHoldModulopt ,
} from "./interfaces";
import { MaskBuilder } from "./MaskBuilder";
import { Modulopt } from "./Modulopt";
import { MOPT_2_USER_ATTENTIONS , MOPT_SORT } from "./moptConstants";

const mopt = Modulopt.getInstance() as Modulopt;
const mb = MaskBuilder.getInstance() as MaskBuilder;

const optionized = <T extends IUseOptions>(
	object: T ,
	beforeOptionizeObject: IBeforeOptionizeObject ,
	hint = false
): T => {
	const definitions: IRowsOption = {} as IRowsOption;

	const { optionVector , totalOffset } = beforeOptionizeObject;

	const buildDef: IBuild = { cpt : 0 , optionVector , definitions };

	mopt.buildDefinition( object.modulopt , totalOffset , buildDef );

	mopt.populateOptionsObjects( object.modulopt , definitions );

	object.options = Object.assign( {} , object.modulopt.defaults );

	hintDefinitions( object , hint );

	return object;
};

const fetchModuloptConfig = () => {
	const onMissingDo: ( string | string[] )[] = [
		"ignore" , MOPT_2_USER_ATTENTIONS ,
	];

	return [
		( [ "mismatch" ] as any[] ).concat( onMissingDo ) ,
		( [ "misspelled" ] as any[] ).concat( onMissingDo ) ,
		( [ "mysterious" ] as any[] ).concat( onMissingDo ) ,
		[ "mysteriousAffect" , false ] ,
		MOPT_SORT
	];
};

const fixModuloptConfig = ( object: IUseOptions , optionVector: any[] ) => {
	let foundConfigIndex = -1;

	optionVector.forEach( ( e , i ) => {
		if ( e[ 0 ] === "modulopt" ) {
			foundConfigIndex = i;
			return;
		}
	} );

	if ( foundConfigIndex !== -1 ) {
		stickOptions( object , optionVector[ foundConfigIndex ][ 1 ] );
		optionVector.splice( foundConfigIndex , 1 );
	}
};

const addModuloptConfig = ( object: IUseOptions ) => {

	// set a vector containing only modulopt config;
	const moduloptVector = fetchModuloptConfig();

	object.modulopt.config = {} as IUseOptions;

	const isConfig = true;

	const configured = beforeOptionize(
		object.modulopt.config ,
		moduloptVector ,
		isConfig
	);

	optionized( object.modulopt.config , configured );
};

const beforeOptionize = (
	object: IUseOptions ,
	optionVector: any[] ,
	isConfig = false
): any => {
	object.modulopt = {} as IHoldModulopt;
	if ( !isConfig ) {
		addModuloptConfig( object );
		object.modulopt.logs = [];

		fixModuloptConfig( object.modulopt.config , optionVector );
	}
	const sortedVector = sortEntries( object.modulopt.config , optionVector );

	// used to define the size of masks
	const totalOffset = mb.computeOffset( sortedVector );

	object.modulopt.optionsOffset = totalOffset;

	// initialize the different object to attach to the IUseOption object
	object.modulopt.masks = {};
	object.modulopt.free = {};
	object.modulopt.defaults = {};

	return { optionVector : sortedVector , totalOffset };
};

const prepareOptionObject = <T extends IUseOptions>( object: T ) => {
	if ( !object.options ) {
		object.options = Object.assign( {} , object.modulopt.defaults );
	} else {

		// use the copy of the current state of the options
		object.options = Object.assign( {} , object.options );
	}
};

const sortEntries = ( config: IUseOptions , optionVector: any[] ) => {
	const sortFunction = ( a: any[] , b: any[] ) => {
		const result = a[ 0 ] > b[ 0 ] ? 1 : a[ 0 ] < b[ 0 ] ? -1 : 0;
		return result;
	};

	if ( config && config.options.sort !== "no" ) {
		if ( config.options.sort === "asc" ) {
			return optionVector.sort( sortFunction );
		} else if ( config.options.sort === "dsc" ) {
			return optionVector.sort( sortFunction ).reverse();
		}
	}
	return optionVector;
};

export { sortEntries , prepareOptionObject , beforeOptionize , optionized };
