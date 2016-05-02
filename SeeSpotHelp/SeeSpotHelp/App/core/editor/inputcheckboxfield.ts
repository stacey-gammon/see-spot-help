import * as React from 'react';

import InputField from "./inputfield";
import { InputFieldType } from "./inputfield";

export default class InputCheckBoxField extends InputField {
	public type: InputFieldType = InputFieldType.LIST;
	public label: string = null;

	constructor (label, validations?) {
		super(validations);
		this.label = label;
	}

	getDefaultValue() {
		return false;
	}
}
