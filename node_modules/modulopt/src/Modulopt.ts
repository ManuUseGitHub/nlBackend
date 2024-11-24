import { IBuild , IColumnOption , IHoldModulopt , IRowsOption } from "./interfaces";
import { MaskBuilder } from "./MaskBuilder";

const mb = MaskBuilder.getInstance();

export class Modulopt {

    private static instance: Modulopt;

    private constructor() { }

    public static getInstance(): Modulopt {
        if ( !Modulopt.instance ) {
            Modulopt.instance = new Modulopt();
        }

        return Modulopt.instance;
    }

    public populateOptionsObjects(
        modulopt : IHoldModulopt ,
        definitions: IRowsOption
    ){
        const maskKeys: string[] = Object.keys( modulopt.masks );
        const defKeys: string[] = Object.keys( definitions );
    
        defKeys.map( ( key ) => {
            modulopt.defaults[ key ] = ( definitions as any )[ key ].default;
            if ( definitions[ key ].mask ) {
                this.treatObjectWithMask( modulopt , definitions , key );
            } else if ( !definitions[ key ].mask && !maskKeys.includes( key ) ) {
                this.treatObjectWithoutMask( modulopt , definitions , key );
            }
        } );
    }

    public buildDefinition(
        modulopt : IHoldModulopt ,
        totalOffset: number ,
        buildDef: IBuild
    ){
        buildDef.optionVector.map( ( row ) => {
            if ( row[ 2 ] !== undefined || typeof row[ 1 ] === "boolean" ) {
                this.treatDefinitionsWithIntervals( modulopt , row , totalOffset , buildDef );
    
                // filter options without intervals or those that cannot have a binary representation
            } else if (
                1 <= row.length &&
                row.length <= 2 &&
                typeof row[ 1 ] !== "boolean"
            ) {
                this.treatDefinitionsWithoutInterval( row , buildDef );
            }
        } );
    }

    private treatObjectWithMask(
        modulopt : IHoldModulopt ,
        definitions: IRowsOption ,
        key: string
    ){
    
        // add a mask to the IUseOption object
        const mask = ( definitions as any )[ key ].mask;
        modulopt.masks[ mask ] = key;
    
        // add an entry to defaults
        modulopt.defaults[ key ] = ( definitions as any )[ key ].default;
    }
    
    private treatObjectWithoutMask(
        modulopt : IHoldModulopt ,
        definitions: IRowsOption ,
        key: string
    ){
    
        // add an entry to free options.
        modulopt.free[ key ] = { type : typeof definitions[ key ].default };
    }

    private treatDefinitionsWithIntervals(
        modulopt : IHoldModulopt ,
        row: any[] ,
        totalOffset: number ,
        buildDef: IBuild
    ){
        const { definitions } = buildDef;
    
        // the option name is contained in the first cell
        const option: string = row[ 0 ];
    
        // if the second ceil contain a default that is a boolean, we asume that the offset is 1,
        // therefore the postion is cpt or the interval of cpt + offset
        const interval = mb.defineInterval( row , buildDef.cpt );
    
        // define the default and masks (just simple arrays either with just 1 or an interval)
        const maskDef = { default : row[ 1 ] };
    
        // will write the masks property with good formated masks
        if ( row.length === 2 && typeof row[ 1 ] === "boolean" ) {
            mb.assignMasks( maskDef as IColumnOption , totalOffset , buildDef.cpt );
        }
    
        // will write the multiOptMasks property with good formated masks
        mb.assignValuePerBit( modulopt , row , buildDef.cpt , totalOffset );
    
        definitions[ option ] = maskDef as IColumnOption;
        buildDef.cpt = interval[ interval.length - 1 ] + 1; // the last element of the interval +1
    }
    
    /**
     * Help to build the definitions about available straight forward options and their defaults
     * @param row
     * @param buildDef parameter object that holds definitions and optionVector
     */
    private treatDefinitionsWithoutInterval( row: any[] , buildDef: IBuild ){
        const { definitions } = buildDef;
    
        // store the name of the option
        const option: string = row[ 0 ];
    
        // the default of the option is either the element 1 of the record or null if ther is no element 1
        const _default = typeof row[ 1 ] !== "undefined" ? row[ 1 ] : null;
    
        // create a new entry on the definitions object
        definitions[ option ] = { default : _default } as IColumnOption;
    }
}