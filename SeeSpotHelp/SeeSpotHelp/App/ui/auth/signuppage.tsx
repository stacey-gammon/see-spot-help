"use strict"

import * as React from 'react';
import FacebookLogin from './facebooklogin';
import EmailAndPassword from './emailandpassword';
import Utils from '../uiutils';
import LoginStore from '../../stores/loginstore';
var Loader = require('react-loader');
import DataServices from '../../core/dataservices';
import InputField from '../../core/editor/inputfields/inputfield';
import InputFieldElement from '../shared/editor/inputfield';
import { InputFieldType } from '../../core/editor/inputfields/inputfield';

export default class SignupPage extends React.Component<any, any> {
  public context: any;

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    var logout = Utils.FindPassedInProperty(this, 'logout');
    this.state = {
      loading: LoginStore.authenticated === null,
      error: false,
      logout: logout,
      name: null,
      email: null
    }
  }

  onChange() {
    this.setState({loading: LoginStore.authenticated === null});
  }

  componentDidMount () {
    LoginStore.addChangeListener(this.onChange);
  }

  componentWillUnmount () {
    LoginStore.removeChangeListener(this.onChange);
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  getMessage () {
    if (this.state.error || this.state.message) {
      var messageStyle = this.state.error ? "alert alert-danger" : "alert alert-success";
      return (
        <div className={messageStyle}>
          {this.state.message}
        </div>
      );
    } else {
      return null;
    }
  }

  validate() {
    if (this.refs.password.getValue() != this.refs.passwordConfirm.getValue()) {
      this.setState({error: true, message: 'Passwords do not match.'});
      return false;
    }

    if (!this.refs.name.getValue()) {
      this.setState({error: true, message: 'Please enter a name.'});
      return false;
    }

    return true;
  }

  updateUsersName() {
    LoginStore.getUser().name = this.state.name;
    LoginStore.getUser().update();
    this.context.router.push("/profilePage");
  }

  signUp() {
    this.setState({name: this.refs.name.getValue(), email: this.refs.email.getValue()});

    if (this.validate()) {
      this.setState({loading: true });
      DataServices.SignUpWithEmailAndPassword(
          this.refs.email.getValue(),
          this.refs.password.getValue()).then(function() {
        LoginStore.addChangeListener(this.updateUsersName.bind(this));
      }.bind(this)).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        this.onError(errorMessage);
      }.bind(this));
    }
  }

  onError (message : string) {
    this.setState({loading: false, error: true, message: message});
  }

  onSuccess (message : string) {
    this.setState({loading: false, error: false, message: message});
  }

  createInputField(inputField: InputField) {
    return <InputFieldElement key={inputField.ref} ref={inputField.ref} inputField={inputField}/>
  }

  getNameField() {
    var inputField = new InputField();
    inputField.ref = 'name';
    inputField.value = this.state.name;
    return inputField;
  }

  getEmailField() {
    var inputField = new InputField();
    inputField.ref = 'email';
    inputField.value = this.state.email;
    return inputField;
  }

  getPasswordField(confirm) {
    var inputField = new InputField();
    inputField.ref = confirm ? 'passwordConfirm' : 'password';
    inputField.type = InputFieldType.PASSWORD;
    return inputField;
  }

  render () {
    return (
        <div className="loginPage text-center" style={{margin: '0 auto', maxWidth: '600px', textAlign: 'center'}}>
          <div className='header-bar'>
            <img src="images/logo.png" height="70px"/>
          </div>
          <Loader loaded={!this.state.loading} color="rgba(0,0,0,0.2)">
            <div className='login-page'>
              <label>Sign up</label>
                {this.getMessage()}
                {this.createInputField(this.getNameField())}
                {this.createInputField(this.getEmailField())}
                {this.createInputField(this.getPasswordField(false))}
                {this.createInputField(this.getPasswordField(true))}
                <div class="row">
                  <button className="btn btn-info btn-big" onClick={this.signUp.bind(this)}>Sign Up</button>
                  <a className='tiny-text' href='#loginpage'>
                  <br/>
                  Already have an account?  Login here </a>
                </div>
            </div>
          </Loader>
        </div>
    );
  }
}
