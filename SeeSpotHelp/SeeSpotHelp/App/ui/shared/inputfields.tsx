import * as React from 'react';

import InputField from '../../core/inputfield';
import InputTextField from '../shared/inputtextfield';

export default class InputFields extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	createInputField(inputField) {
		return <InputTextField inputField={inputField}/>
	}

	render() {
		var inputFieldElements = [];
		for (var key in this.props.fields) {
			inputFieldElements.push(this.createInputField(this.props.fields[key]));
		}
		return <div> {inputFieldElements} </div>
	}
}
