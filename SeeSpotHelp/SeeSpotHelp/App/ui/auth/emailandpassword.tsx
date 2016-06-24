'use strict'

import * as React from 'react';
import LoginStore from '../../stores/loginstore';
import DataServices from '../../core/dataservices';
import InputField from '../../core/editor/inputfields/inputfield';
import InputFieldElement from '../shared/editor/inputfield';
import { InputFieldType } from '../../core/editor/inputfields/inputfield';

export default class EmailAndPasswordLogin extends React.Component<any, any> {
  public context: any;

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      email: null
    };
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

  login() {
    this.setState({email: this.refs.email.getValue()});
    this.props.onLoginAction();
    LoginStore.authenticateWithEmailPassword(
        this.refs.email.getValue(),
        this.refs.password.getValue()).then(function() {
      this.context.router.push('/profilePage');
    }.bind(this)).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      this.props.onError(errorMessage);
    }.bind(this));
  }

  createInputField(inputField: InputField) {
    return <InputFieldElement key={inputField.ref} ref={inputField.ref} inputField={inputField}/>
  }

  getEmailField() {
    var inputField = new InputField();
    inputField.ref = 'email';
    inputField.value = this.state.email;
    return inputField;
  }

  getPasswordField() {
    var inputField = new InputField();
    inputField.ref = 'password';
    inputField.type = InputFieldType.PASSWORD;
    return inputField;
  }

  resetPassword () {
    if (confirm('Are you sure you wish to reset the password for email ' + this.refs.email.getValue() + '?')) {
      DataServices.ResetPassword(this.refs.email.getValue()).then(function() {
        this.props.onSuccess('Password successfully reset. Please check your email.');
      }.bind(this))
      .catch(function(error) {
        var errorMessage = error.message;
        this.props.onError(errorMessage, true);
      });
    }
  }

  getResetLink() {
    if (this.props.showResetLink) {
      return <a className='tiny-text' onClick={this.resetPassword.bind(this)}>Forgot your password? Reset it.</a>
    }
    return null;
  }

  render() {
    return (
      <div className="email-log-in">
        {this.getResetLink()}
        {this.createInputField(this.getEmailField())}
        {this.createInputField(this.getPasswordField())}
        <div class="row">
          <button className="btn btn-info btn-big" onClick={this.login.bind(this)}>Log In</button>
        </div>
        <a className='tiny-text' href='#signuppage'>Don't have an account?  Sign up here </a><br/>
      </div>
    );
  }
}
