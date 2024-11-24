/* eslint-disable no-prototype-builtins */

import { checkValidCall } from "./dialog";
import { IUseOptions , IOptions } from "./interfaces";
import { MaskBuilder } from "./MaskBuilder";
import { prepareOptionObject } from "./prepare";

const mb = MaskBuilder.getInstance() as MaskBuilder;

const isSubObject = ( object1: any , object2: any ) => {
	for ( const key in object2 ) {

		// stop if the key exists in the subobject but not in the main object
		if ( object2.hasOwnProperty( key ) && !object1.hasOwnProperty( key ) ) {
			if ( typeof object2.key !== "function" ) {
				return false;
			}
		}
	}
	return true;
};

const fixOptions = <T extends IUseOptions>( object: T , options: IOptions ) => {
	prepareOptionObject( object );

	if ( object.modulopt ) {
		Object.keys( options ).map( ( key: string ) => {
			const value = options[ key ];

			if ( object.options[ key ] === undefined ) {
				checkValidCall( { data : object , key , kind : "options" , value } );
			}

			const handled = isMultiChoiceOptionsHandled( object , key , options );
			if ( !handled ) {

				// handle free options (default is null)
				if ( object.modulopt.defaults[ key ] === null ) {

					// affect a value options[ key ] except if it is undefinied : fallbacks to null;
					object.options[ key ] =
						options[ key ] === undefined ? null : options[ key ];

				} else if (
					typeof object.modulopt.defaults[ key ] === typeof options[ key ]
				) {
					object.options[ key ] = options[ key ];
				} else {

					if( object.modulopt.config.options.mysterious !== "ignore" ){
						
						const refererObj = object.options[ key ];
						const subObj = options[ key ];

						if( !isSubObject( refererObj , subObj ) ) {
							checkValidCall( { data : object , key , kind : "free" , value } );
						}
					}

					if( object.modulopt.config.options.mysteriousAffect ){
						object.options[ key ] = options[ key ];
					}
				}
			}
		} );
	}
};

const isMultiChoiceOptionsHandled = <T extends IUseOptions>(
	object: T ,
	key: string ,
	options: IOptions
): boolean => {
	const multiChoices = object.modulopt.masks[ key ];
	const value = options[ key ];

	if ( multiChoices ) {

		// if the value is one of the multiple choice options
		if ( Object.values( multiChoices ).includes( value ) ) {
			object.options[ key ] = options[ key ];
		} else {
			checkValidCall( { data : object , key , kind : "propositions" , value } );
		}
		return true;
	}
	return false;
};

const stickOptions = <T extends IUseOptions>( object: T , ...options: any ): T => {
	options
		.sort( ( a: any , b: any ) => ( typeof a < typeof b ? 1 : -1 ) )
		.forEach( ( optSet: any ) => {
			if ( typeof optSet === "string" ) {
				object.options = mb.getOptionsFromMask( object.modulopt! , optSet );
			} else if ( typeof optSet === "object" ) {
				fixOptions( object , optSet );
			}
		} );

	return object;
};

export { stickOptions , fixOptions };
