import * as React from 'react';
var Loader = require('react-loader');

import InputField from '../../../core/editor/inputfields/inputfield';
import GroupSelectField from '../../../core/editor/inputfields/groupselectfield';
import { InputFieldType } from '../../../core/editor/inputfields/inputfield';

export default class GroupSelectFieldUI extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  getValue() {
    var element = this.refs[this.props.inputField.ref];
    return element ? element.value : this.props.inputField.getDefaultValue();
  }

  componentDidMount() {
    this.props.inputField.onLoad = this.onChange.bind(this);
    this.props.inputField.populate();
    this.setState({
      loaded: !this.props.inputField.loading
    });
  }

  onChange() {
    this.props.inputField.value = this.getValue();
    this.props.inputField.onChange();
    this.setState({
      loaded: !this.props.inputField.loading
    });
  }

  createTypeOption(option) {
    return <option value={option.value}>{option.name}</option>
  }

  getInputListElement(inputField: GroupSelectField) {
    if (inputField.loading) {
      return <Loader loaded={this.state.loaded}/>
    }
    var inputFieldClassName = 'form-control ' + inputField.ref;
    var options = inputField.options.map(this.createTypeOption);
    var defaultValue = inputField.value ? inputField.value : inputField.getDefaultValue();
    inputField.value = defaultValue;
    inputField.onChange();
    return (
      <select defaultValue={defaultValue}
          className={inputFieldClassName}
          onChange={this.onChange.bind(this)}
          id={inputField.ref}
          ref={inputField.ref}>
        {options}
      </select>);
  }

  render() {
    return this.getInputListElement(this.props.inputField);
  }
}
