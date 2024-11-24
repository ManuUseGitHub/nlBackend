import { IColumnOption , IHoldModulopt , IOptions } from "./interfaces";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultCall = ( key: string , previousKey: string , value: any ): number => {
	return 0;
};

/**
 * Masks can be written following this format 11.1111.11 (with dots to avoid mistakes)
 * so it is necessary to strip all dots out of the masks so we can process them as real
 * masks
 * @param s
 * @returns
 */
const stripDots = ( s: string ): string => s.replace( /[.]/g , "" );

const substituteTwos = ( s: string ): string => s.replace( /2/g , "1" );

export class MaskBuilder {
	private static instance: MaskBuilder;

	private constructor() {}

	public static getInstance(): MaskBuilder {
		if ( !MaskBuilder.instance ) {
			MaskBuilder.instance = new MaskBuilder();
		}

		return MaskBuilder.instance;
	}

	/**
	 * Gives a bit representation for every multiChoices option
	 * @param object
	 * @param row entry [optionName [,default][,multiChoices] ]
	 * @param cpt counter
	 * @param totalOffset totalizer of the offset
	 */
	public assignValuePerBit(
		modulopt: IHoldModulopt ,
		row: any ,
		cpt: number ,
		totalOffset: number
	) {
		if ( row[ 2 ] ) {

			// compute the current element offset by looking at the length of its 3rd collumn
			const offset = row[ 2 ].length;

			// the option name is in the first collumn
			const option = row[ 0 ];

			// initialisation on the object that will host the options
			modulopt.masks[ option ] = {} as IOptions;

			// for every option that is coded on multiple bit, we compute the range of bits that
			// it takes by using the incrementation
			for ( let i = 0; i < offset; ++i ) {

				// get the pow2 of the cpt value ==> to transform into binary representation
				const bit = Math.pow( 2 , cpt + i );

				// get the representation with dots every 4th digit
				const representation = this.formatedNumberRepresentation(
					bit ,
					totalOffset
				);

				// undefined and function references cannot be added so we just tell what we were supposed to have
				if ( typeof row[ 2 ][ i ] === "function" || row[ 2 ][ i ] === void 0 ) {
					row[ 2 ][ i ] = ( typeof row[ 2 ][ i ] ).toUpperCase();
				}

				// assign the matching bit to the option coded on multiple bits
				modulopt.masks[ option ][ representation ] = row[ 2 ][ i ];
			}
		}
	}

	/**
	 * Every option will occupied a certain amount of space as a bit reprensentation so to be sure nothing
	 * overlaps, and mostly, have consistent zero-filled (padded) masks, we have to compute the total offset
	 * @param optionVector
	 * @returns
	 */
	public computeOffset( optionVector: any[] ) {
		let offset = 0;
		optionVector
			.filter(
				( row ) => ( typeof row[ 1 ] === "boolean" && row.length === 2 ) || row[ 2 ]
			)
			.map( ( row ) => {

				// sum an offset stored in a cell of an array (may not exist so fallback of 1)
				offset += row[ 2 ] ? row[ 2 ].length : 1;
			} );

		// ceiled integer division multiplied by 4 so we have multiples of four. Perfect for bin reprsentation
		return Math.ceil( offset / 4 ) * 4;
	}

	/**
	 * Transform a number into its sero filled dotted binary format. 1 => 0000.0000.0001
	 *
	 * @param optDef defines the default value for an option and its string masks
	 * @param offset the offset teken by possible values of the mask in binary : 1 take , 0 leave
	 * @param totalOffset indicate the whole space taken by all option mask + 0 fill included
	 * @param cpt the general counter
	 */
	public assignMasks( optDef: IColumnOption , totalOffset: number , cpt: number ) {
		const representation = this.formatedNumberRepresentation(
			Math.pow( 2 , cpt ) ,
			totalOffset
		);

		// (join every slices by a dot then push to the masks field)
		// [0000,0000,1000] => ["0000.0000.1000","0000.0001.0000"]
		if ( representation !== "-1" ) {
			optDef.mask = representation;
		}
	}

	/**
	 * Transforms a number value to its binary representation with 1 dot every 4th bit
	 * @param value
	 * @param totalOffset
	 * @returns
	 */
	public formatedNumberRepresentation( value: number , totalOffset: number ) {

		// transform the position on the iteration into a binary representation as it is a power of 2 bin
		// 2^(cpt+i) => 1, 2, 4, 8 =>  0 , 1 , 10 , 100 , 1000
		const binRep = this.dec2bin( value );

		// = for every 4 bit represented, add a dot so it is easier to manupulate as a human =
		// (division into array of strings) => 000000001000 => [0000,0000,1000]
		const sliceOfFour: RegExpMatchArray | null = this.pad(
			binRep ,
			totalOffset
		).match( /.{1,4}/g );

		if ( sliceOfFour ) {
			return sliceOfFour.join( "." );
		}

		return "-1";
	}

	public defineInterval( row: any , cpt: number ): number[] {
		return typeof row[ 1 ] === "boolean" && row.length === 2
			? [ cpt ]
			: row[ 2 ]
			? [ cpt , -1 + cpt + row[ 2 ].length ]
			: [ cpt ];
	}

	public getOptionsFromMask( modulopt: IHoldModulopt , optionMask: string ): any {
		const options: any = {};
		const masks = this.masksMappedByName( modulopt.masks );

		Object.keys( masks ).map( ( k ) => {
			options[ k ] = this.chosenFromMask( modulopt , optionMask , k );
		} );

		return options;
	}

	/**
	 * Transforms decimal number into binary representation
	 * @param dec
	 * @returns
	 */
	private dec2bin( dec: number ) {
		return ( dec >>> 0 ).toString( 2 );
	}

	/**
	 * Pads zero (zero fill a number). It provides a string since 0 before any number is not significant
	 * @param num the number that has to gain the padding
	 * @param size the offset of the resulting string
	 * @returns
	 */
	private pad( num: string , size: number ): string {
		num = num.toString();
		while ( num.length < size ) num = "0" + num;
		return num;
	}

	private masksMappedByName( masks: IOptions , cb = defaultCall , previousKey = "" ) {
		const mapped: IOptions = {};

		for ( const [ key , value ] of Object.entries( masks ) ) {
			if ( typeof value === "string" || previousKey ) {
				mapped[ value ] = key;
				const result: number = cb( key , previousKey , value );
				if ( result != 0 ) {
					return result;
				}
			} else if ( typeof value === "object" ) {
				mapped[ key ] = this.masksMappedByName( value , cb , key );
			}
		}
		return mapped;
	}

	private applyMasks( masks: IOptions , a: string , maskField: string ) {
		let result = 0;
		const onAssociation = (
			key: string ,
			previousKey: string ,
			value: any
		): number => {
			if ( maskField === value || maskField === previousKey ) {

				// the key is the actual mask
				const b = stripDots( key as string );

				// bitwise comparison on base 2
				result = parseInt( a , 2 ) & parseInt( b , 2 );
				if ( result != 0 ) {
					return result;
				}
			}
			return 0;
		};

		// invert keys and values of the masks so we have option name as index of the object
		this.masksMappedByName( masks , onAssociation );

		return result;
	}

	/**
	 * from a string mask containing 0 - 1 - 2, that produce an other mask;
	 * "2" => "true":1 ... "1" => "false":0 ... "0" => default : "-"
	 * @param setMask
	 */
	private guessMaskFromMask( setMask: string ): string {
		const result = [];
		let i = 0;
		setMask = stripDots( setMask );

		for ( ; i < setMask.length; ++i ) {
			const c = setMask.charAt( i );
			result.push( c === "2" ? 1 : c === "1" ? 0 : "-" );
		}
		return result.join( "" );
	}

	private defineSortOption( modulopt: IHoldModulopt , bit: number , maskField: string ) {
		const offset = modulopt.optionsOffset;
		const representation = this.formatedNumberRepresentation( bit , offset );
		return modulopt.masks[ maskField ][ representation ];
	}

	private defineBooleansOption( defaults: IOptions , bit: string , option: string ) {
		switch ( bit ) {
			case "1" :
				return true;
			case "0" :
				return false;
			default :
				return defaults[ option ];
		}
	}

	private chosenFromMask( modulopt: IHoldModulopt , setMask: string , maskField: string ) {
		const a = substituteTwos( stripDots( setMask ) );
		const c = this.guessMaskFromMask( setMask );

		const result = this.applyMasks( modulopt.masks , a , maskField );

		if ( result > 0 ) {
			const bitPosFromRight = Math.log2( result );
			const position = -1 + c.length - bitPosFromRight;

			const offset = modulopt.optionsOffset;
			const representation = this.formatedNumberRepresentation( result , offset );
			const booleanMask = modulopt.masks[ representation ];

			// does the result indicates a bit value that aims a boolean ?
			if ( typeof booleanMask === "string" ) {
				const result = this.defineBooleansOption(
					modulopt.defaults ,
					c[ position ] ,
					booleanMask
				);
				return result;
			} else {

				// INFO: Treat non binar cases
				return this.defineSortOption( modulopt , result , maskField );
			}
		}
		const option = /[\d.]/g.test( maskField )
			? modulopt.masks[ maskField ]
			: maskField;

		return modulopt.defaults[ option ];
	}
}
