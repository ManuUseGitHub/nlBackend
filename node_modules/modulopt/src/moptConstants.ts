export const NOT_FOUND_CODE = 404;
export const BAD_REQUEST = 400;
export const MOPT_SORT = [ "sort" , "no" , [ "asc" , "dsc" ] ];
export const MOPT_2_USER_ATTENTIONS = [ "throw" , "yell" , "inform" , "warn" , "debug" , "report" ];
export const DEFAULT_MOPT_CONFIG = {
    options : {
        misspelled : "ignore" ,
        mismatch : "ignore" ,
        mysterious : "ignore" , 
        mysteriousAffect : false
    } ,
};

// verbs methods interactions
export const VMI: any = {
	inform : { interaction : "info" , type : "INFO" } ,
	yell : { interaction : "error" , type : "ERROR" } ,
	warn : { interaction : "warn" , type : "WARNING" } ,
	debug : { interaction : "log" , type : "DEBUG" } ,
};