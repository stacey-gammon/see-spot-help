import * as React from 'react';

import InputField from '../../../core/editor/inputfield';
import InputListField from '../../../core/editor/inputlistfield';
import { InputFieldType } from '../../../core/editor/inputfield';

export default class InputFieldElement extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	getValue() {
		var element = this.refs[this.props.inputField.ref] as any;
		return element.value;
	}

	createTypeOption(option) {
		return (
			<option value={option}>{option}</option>
		);
	}

	getInputListElement(inputField: InputListField) {
		var inputFieldClassName = 'form-control ' + inputField.ref;
		var options = inputField.listItems.map(this.createTypeOption);
		var defaultValue = inputField.value ? inputField.value : inputField.getDefaultValue();
		return (
			<select defaultValue={defaultValue}
					className={inputFieldClassName}
					id={inputField.ref} ref={inputField.ref}>
				{options}
			</select>);
	}

	getInputTextAreaElement(inputField) {
		var inputFieldClassName = 'form-control ' + inputField.ref;
		return (
			<textarea
				className={inputFieldClassName}
				ref={inputField.ref}
				id={inputField.ref}
				rows="5"
				defaultValue={inputField.value}>
			</textarea>);
	}

	getInputTextElement(inputField) {
		var inputFieldClassName = 'form-control ' + inputField.ref;
		return (
			<input type='text'
			   ref={inputField.ref}
			   id={inputField.ref}
			   className={inputFieldClassName}
			   defaultValue={inputField.value}/>);
	}

	getInputElement(inputField) {
		if (inputField.type == InputFieldType.TEXT) {
			return this.getInputTextElement(inputField);
		} else if (inputField.type == InputFieldType.TEXT_AREA) {
			return this.getInputTextAreaElement(inputField);
		} else if (inputField.type == InputFieldType.LIST) {
			return this.getInputListElement(inputField);
		} else {
			return null;
		}
	}

	render() {
		var inputField = this.props.inputField;
		var inputFieldClassName = 'form-control ' + inputField.ref;
		return (
			<div className={inputField.getFormGroupClassName()}>
				{inputField.getErrorLabel()}
				<div className='input-group'>
					<span className='input-group-addon'>{inputField.getUserString()}</span>
					{this.getInputElement(inputField)}
				</div>
				{inputField.getValidationSpan()}
			</div>
		);
	}
}
