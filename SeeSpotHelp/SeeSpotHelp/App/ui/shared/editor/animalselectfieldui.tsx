import * as React from 'react';
var Loader = require('react-loader');

import InputField from '../../../core/editor/inputfields/inputfield';
import AnimalSelectField from '../../../core/editor/inputfields/animalselectfield';
import { InputFieldType } from '../../../core/editor/inputfields/inputfield';

export default class AnimalSelectFieldUI extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  getValue() {
    return this.refs[this.props.inputField.ref].value;
  }

  componentDidMount() {
    this.props.inputField.onLoad = this.onChange.bind(this);
    this.props.inputField.onChange = this.onChange.bind(this);
    if (this.props.groupId) {
      this.props.inputField.populate(this.props.groupId);
    }
    this.setState({
      loaded: !this.props.inputField.loading
    });
  }

  onChange() {
    this.setState({
      loaded: !this.props.inputField.loading
    });
  }

  createTypeOption(option) {
    return <option value={option.value}>{option.name}</option>
  }

  getInputListElement(inputField: AnimalSelectField) {
    if (inputField.loading) {
      return <Loader loaded={this.state.loaded}/>
    }
    var inputFieldClassName = 'form-control ' + inputField.ref;
    var options = inputField.options.map(this.createTypeOption);
    var defaultValue = inputField.value ? inputField.value : inputField.getDefaultValue();
    return (
      <select defaultValue={defaultValue}
          className={inputFieldClassName}
          id={inputField.ref} ref={inputField.ref}>
        {options}
      </select>);
  }

  render() {
    return this.getInputListElement(this.props.inputField);
  }
}
