import * as React from 'react';

var expect = require('expect');
var Promise = require('bluebird');

import LoginStore from '../../stores/loginstore';
import TestHelper from '../testhelper';
import TestData from '../testdata';
var Firebase = require('firebase');

describe("LoginStore Test", function () {

  // beforeEach(function() {
  //   this.timeout(100000);
  //   return TestHelper.CreateTestData();
  // });
  //
  // afterEach(function() {
  //   this.timeout(100000);
  //   return TestHelper.DeleteAllTestData();
  // });

  it("Ensure user when logged in, fresh browser", function (done) {
    this.timeout(50000);

    return TestHelper.LoginAsAdmin()
        .then(() => {
          // Simulate a new tab open, and LoginStore should be set to default values.
          LoginStore['user'] = null;
          LoginStore.authenticated = false;

          let promise1 = LoginStore.ensureUser().then(() => {
            expect(LoginStore.getUser()).toNotEqual(null);
          });
          let promise2 = LoginStore.ensureUser().then(() => {
            expect(LoginStore.getUser()).toNotEqual(null);
          });

          LoginStore.ensureUser()
          // ensure user should auto login.
          return Promise.all([promise1, promise2])
              .then(() => {
                expect(LoginStore.getUser()).toNotEqual(null);
                done();
              })
              .catch((error) => {
                console.log('Error: ', error);
                throw error;
              });
        });
  });
})
