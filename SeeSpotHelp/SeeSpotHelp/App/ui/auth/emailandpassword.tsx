'use strict'

import * as React from 'react';
import LoginStore from '../../stores/loginstore';
import InputField from '../../core/editor/inputfields/inputfield';
import InputFieldElement from '../shared/editor/inputfield';

export default class EmailAndPasswordLogin extends React.Component<any, any> {
  public context: any;

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  onError(errorMessage) {
    this.setState({error: true, errorMessage: "Login Failed"});
    if (this.props.onError) {
      this.props.onError(errorMessage);
    }
  }

  onAuthenticated() {
    this.context.router.push('/profilePage');
  }

  signUp() {

  }

  loginIn() {

  }

  getMessage() {
    if (this.state.errorMessage) {
      var messageStyle = this.state.error ? "alert alert-danger" : "alert alert-success";
      return (
        <div className={messageStyle}>
          {this.state.errorMessage}
        </div>
      );
    } else {
      return null;
    }
  }

  createLinkElement(className, text) {
      return (
        <div style={{display: 'inline-block'}} onClick={this.loginAction}>{text}</div>
    );
  }

  createInputField(inputField: InputField) {
    return <InputFieldElement key={inputField.ref} ref={inputField.ref} inputField={inputField}/>
  }

  getEmailField() {
    var inputField = new InputField();
    inputField.ref = 'Email';
    return inputField;
  }

  getPasswordField() {
    var inputField = new InputField();
    inputField.ref = 'Password';
    return inputField;
  }

  render() {
    return (
      <div className="email-log-in">
        {this.createInputField(this.getEmailField())}
        {this.createInputField(this.getPasswordField())}
        <div class="row">
          <button className="btn btn-info btn-big">Sign Up</button>
          <button className="btn btn-info btn-big">Log In</button>
        </div>
      </div>
    );
  }
}
