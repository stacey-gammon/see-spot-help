import * as React from 'react';

import InputField from '../../core/inputfield';

export default class InputTextField extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	render() {
		var inputField = this.props.inputField;
		var inputFieldClassName = 'form-control ' + inputField.ref;
		return (
			<div className={inputField.getFormGroupClassName()}>
				{inputField.getErrorLabel()}
				<div className='input-group'>
					<span className='input-group-addon'>{inputField.getUserString()}</span>
					<input type='text'
						   ref={inputField.ref}
						   id={inputField.ref}
						   className={inputFieldClassName}
						   defaultValue={inputField.value}/>
				</div>
				{inputField.getValidationSpan()}
			</div>
		);
	}
}
