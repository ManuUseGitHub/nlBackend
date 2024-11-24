import { IUseOptions } from "./interfaces";
import {
	beforeOptionize ,
	optionized
} from "./prepare";
import { stickOptions } from "./apply";

const optionize = <T extends IUseOptions>(
	object: T ,
	optionVector: any[] ,
	hint:boolean|undefined = false
): T => {
	const result = optionized(
		object ,
		beforeOptionize( object , optionVector ) ,
		hint
	);

	return result;
};

const stick = <T extends IUseOptions>( object: T , ...options: any ): T => {
	return stickOptions( object , ...options );
};

const reset = <T extends IUseOptions>( object: T ) => {
	object.modulopt.logs = [];
};

export { optionize , stick , reset };
