
import * as React from 'react';

var moment = require('moment');
import $ = require('jquery');
global['jQuery'] = require('jquery');

var TimePicker = require('bootstrap-timepicker/js/bootstrap-timepicker.js');
require('bootstrap-timepicker/css/bootstrap-timepicker.css');
require('react-datepicker/dist/react-datepicker.css');

export default class TimeInputField extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('#' + this.props.inputField.ref).timepicker({
      minuteStep: 15,
      showInputs: true,
      template: 'dropdown',
      modalBackdrop: true,
      showSeconds: false,
      showMeridian: true,
      defaultTime: this.props.inputField.value
    } as any);
  }

  getValue() {
    return this.refs[this.props.inputField.ref]['value'];
  }

  clickedTime() {
    var defaultTime = this.props.inputField.value
    if (defaultTime == '' && this.getValue() == '') {
      $('#' + this.props.inputField.ref).timepicker('setTime', '12:00pm');
    }
    $('#' + this.props.inputField.ref).timepicker('showWidget');
  }

  render() {
    return (
      <div className="input-group bootstrap-timepicker timepicker"
           id="startTimeDiv"
           data-provide="timepicker"
           data-template="modal"
           data-minute-step="1"
           data-modal-backdrop="true"  >
        <input className="form-control input-small"
               type='text'
               disabled={this.props.inputField.disabled}
               onClick={this.clickedTime.bind(this)}
               defaultValue={this.props.inputField.value}
               id={this.props.inputField.ref}
               ref={this.props.inputField.ref} />
      </div>
    );
  }

}
