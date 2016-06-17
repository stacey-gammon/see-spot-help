
import * as React from 'react';

var DatePicker = require('react-datepicker');

export default class InputDateField extends React.Component<any, any> {
  constructor(props) {
    super(props);
    if (!this.props.inputField.value) {
      this.props.inputField.value = this.props.inputField.defaultValue;
    }
    this.state = {
      date: moment(this.props.inputField.value, 'MM-DD-YYYY')
    }
  }

  onChange(date) {
    this.setState({
      date: date
    })
  }

  getValue() {
    return this.state.date.format('MM-DD-YYYY');
  }

  render() {
    return (
      <DatePicker
        className="form-control"
        style={{display: 'inline-block', margin: '0px 3px', width: '300px'}}
        id="datePicker"
        ref="date"
        disabled={this.props.inputField.disabled}
        onChange={this.onChange.bind(this)}
        selected={this.state.date}
        placeholderText="Start Date"/>
    );
  }
}
