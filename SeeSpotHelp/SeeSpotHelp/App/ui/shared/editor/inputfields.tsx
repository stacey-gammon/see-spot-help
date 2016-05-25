import * as React from 'react';

import InputField from '../../../core/editor/inputfields/inputfield';
import InputFieldElement from './inputfield';

export default class InputFields extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  createInputField(inputField: InputField) {
    return <InputFieldElement key={inputField.ref} ref={inputField.ref} inputField={inputField}/>
  }

  fillWithValues(inputFields) {
    for (var key in inputFields) {
      var inputField = inputFields[key];
      var inputFieldElement = this.refs[inputField.ref] as InputFieldElement;
      inputField.value = inputFieldElement.getValue() ? inputFieldElement.getValue() : '';
    }
  }

  render() {
    var inputFieldElements = [];
    for (var key in this.props.fields) {
      inputFieldElements.push(this.createInputField(this.props.fields[key]));
    }
    return <div> {inputFieldElements} </div>
  }
}
