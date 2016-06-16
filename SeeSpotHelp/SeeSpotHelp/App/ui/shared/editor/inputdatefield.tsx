
import * as React from 'react';

var DatePicker = require('react-datepicker');

export default class InputDateField extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.inputField.value || this.props.inputField.defaultValue
    }
  }

  onChange(date) {
    this.setState({
      date: date
    })
  }

  render() {
    return (
      <DatePicker
        className="form-control"
        style={{display: 'inline-block', margin: '0px 3px', width: '300px'}}
        id="datePicker"
        ref="date"
        disabled={this.props.inputField.disabled}
        selected={this.state.date}
        onChange={this.onChange.bind(this)}
        placeholderText="Start Date"/>
    );
  }
}
