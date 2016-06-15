import * as React from 'react';

var DatePicker = require('react-datepicker');

import InputField from '../../../core/editor/inputfields/inputfield';
import InputListField from '../../../core/editor/inputfields/inputlistfield';
import { InputFieldType } from '../../../core/editor/inputfields/inputfield';

import TimeInputField from './timeinputfield';
import InputAutoSuggestField from './inputautosuggestfield';
import GroupSelectFieldUI from './groupselectfieldui';
import AnimalSelectFieldUI from './animalselectfieldui';

export default class InputFieldElement extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  getValue() {
    var element = this.refs[this.props.inputField.ref] as any;
    var retval = element.value || element.src;
    if (!retval && element.getValue) {
      retval = element.getValue();
    }
    return retval;
  }

  createTypeOption(option) {
    return <option value={option}>{option}</option>
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

  getInputPhotoElement(inputField) {
    if (!inputField.src) {
      return <span className="spinner"><i className='fa fa-spinner fa-spin'></i></span>
    }
    return <img src={inputField.src} height='200px' ref={inputField.ref}/>
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

  getDateInputElement(inputField) {
    return (
      <DatePicker
        className="form-control"
        style={{display: 'inline-block', margin: '0px 3px', width: '300px'}}
        id="datePicker"
        ref="date"
        disabled={inputField.disabled}
        selected={inputField.value}
        onChange={inputField.onChange}
        placeholderText="Start Date"/>
    );
  }

  getInputElement(inputField) {
    if (inputField.type == InputFieldType.TEXT) {
      return this.getInputTextElement(inputField);
    } else if (inputField.type == InputFieldType.TEXT_AREA) {
      return this.getInputTextAreaElement(inputField);
    } else if (inputField.type == InputFieldType.LIST) {
      return this.getInputListElement(inputField);
    } else if (inputField.type == InputFieldType.PHOTO){
      return this.getInputPhotoElement(inputField);
    } else if (inputField.type == InputFieldType.AUTO_SUGGEST) {
      return <InputAutoSuggestField ref={inputField.ref} inputField={inputField} />
    } else if (inputField.type == InputFieldType.GROUP_SELECT) {
      return <GroupSelectFieldUI ref={inputField.ref} inputField={inputField} />
    } else if (inputField.type == InputFieldType.ANIMAL_SELECT) {
      return <AnimalSelectFieldUI ref={inputField.ref} inputField={inputField} />
    } else if (inputField.type == InputFieldType.DATE){
      return this.getDateInputElement(inputField);
    }  else if (inputField.type == InputFieldType.TIME){
      return <TimeInputField ref={inputField.ref} inputField={inputField}/>
    } else {
      return null;
    }
  }

  getLabel(inputField) {
    if (inputField.getUserString()) {
      return (
        <span className='input-group-addon'>{inputField.getUserString()}</span>
      );
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
          {this.getLabel(inputField)}
          {this.getInputElement(inputField)}
        </div>
        {inputField.getValidationSpan()}
      </div>
    );
  }
}
