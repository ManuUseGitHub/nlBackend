export interface IMasks {
	[key: string]: string;
}

export interface IOptions {
	[key: string]: any;
}

export interface IRowsOption {
	[key: string]: IColumnOption;
}

export interface IUseOptions extends IHaveOptions {
	modulopt: IHoldModulopt;
}

export interface ILoggingMessage {
	message: string;
	timestamp: number;
	severity?: number;
	code?: number;
	exception?: any;
	changes?:any[]
}

export interface IFailingCheck {
  data: IOptions;
	key: string;
  value : any;
	kind: string;
}

export interface IHoldModulopt {
	logs: ILoggingMessage[];
	defaults: IOptions;
	masks: IOptions;
	free: IOptions;
	config: IUseOptions;
	optionsOffset: number;
}

export interface IHaveOptions {
	options: IOptions;
}

export interface IBeforeOptionizeObject {
	optionVector: any[];
	totalOffset: number;
}
export interface IColumnOption {
	mask: string;
	default: any;
}

export interface IOptionEntry {
	option: string;
	data: any[];
}

export interface IBuild {
	definitions: IRowsOption;
	optionVector: any[];
	cpt: number;
}
