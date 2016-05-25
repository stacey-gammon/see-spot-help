import * as React from 'react';
var AutoSuggest = require('react-autosuggest');

import InputField from '../../../core/editor/inputfields/inputfield';
import InputListField from '../../../core/editor/inputfields/inputlistfield';
import { InputFieldType } from '../../../core/editor/inputfields/inputfield';

function getSuggestions(value, optionList) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : optionList.filter(option =>
    option.toLowerCase().slice(0, inputLength) === inputValue
  );
}

function getSuggestionValue(suggestion) { // when suggestion selected, this function tells
  return suggestion;                 // what should be the value of the input
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion}</span>
  );
}


export default class InputAutoSuggestField extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      vaue: this.props.inputField.defaultValue || ''
    };
  }

  getValue() {
    return this.state.value;
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue || ''
    });
  }

  onSuggestionsUpdateRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value, this.props.inputField.listItems)
    });
  }

  render() {
    var inputField : InputListField = this.props.inputField;
    var inputFieldClassName = 'form-control ' + inputField.ref;

    const { value, suggestions } = this.state;
    const inputProps = {
      value: this.state.value || '',
      onChange: this.onChange.bind(this)
    };

    return (
      <AutoSuggest className={inputFieldClassName}
                   suggestions={suggestions}
                   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested.bind(this)}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={inputProps} />
    );
  }
}
