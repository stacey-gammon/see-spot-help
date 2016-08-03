import * as React from 'react';
var ReactDOM = require("react-dom");
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');

import Volunteer from '../../../core/databaseobjects/volunteer';
import SignUpPage from '../../../ui/auth/signuppage';
import LoginStore from '../../../stores/loginstore';
import TestHelper from '../../testhelper';
import {GetMockedRouter} from '../../testhelper';
import TestData from '../../testdata';

describe("Sign up page", function () {
  afterEach(function() {
    this.timeout(100000);
    ReactDOM.unmountComponentAtNode(document.body);
    return TestHelper.DeleteAllTestData();
  });

  it("redirects to profile page on sign up", function () {
    this.timeout(50000);
    let SignUpPageElement;
    let email = 'test-signup-user@test-account.com';
    let pw = 'test1234';

    return TestHelper.DeleteUser(email, pw)
        .then(() => { return LoginStore.logout() })
        .then(() => {
          // Neccessary to fake routing information in tests.
          SignUpPage['childContextTypes'] = { router: [] } as any;

          SignUpPageElement = ReactTestUtils.renderIntoDocument(<SignUpPage />);
            // Neccessary to fake routing information in tests.
          TestHelper.AddRouter(SignUpPageElement);

          let nameInput = ReactDOM.findDOMNode(SignUpPageElement.refs.name.refs.name);
          nameInput.value = "Test Sign Up User";
          ReactTestUtils.Simulate.change(nameInput);

          var emailInput = ReactDOM.findDOMNode(SignUpPageElement.refs.email.refs.email);
          emailInput.value = email;
          ReactTestUtils.Simulate.change(emailInput);

          var passWordInput = ReactDOM.findDOMNode(SignUpPageElement.refs.password.refs.password);
          passWordInput.value = pw;
          ReactTestUtils.Simulate.change(passWordInput);

          var passWordConfirmInput = ReactDOM.findDOMNode(SignUpPageElement.refs.passwordConfirm.refs.passwordConfirm);
          passWordConfirmInput.value = pw;
          ReactTestUtils.Simulate.change(passWordConfirmInput);

          var signUpButton = ReactDOM.findDOMNode(SignUpPageElement.refs.signUpButton);
          ReactTestUtils.Simulate.click(signUpButton);

          return new Promise((resolve, reject) => {
            // Give time for the sign up to finish.
            setTimeout(() => {
              expect(SignUpPageElement.state.loading).toEqual(false);
              expect(SignUpPageElement.context.router.has('/profilePage')).toBe(true);
              ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(SignUpPageElement).parentNode);
              resolve();
            }, 10000);
        });
      });
  });

});
