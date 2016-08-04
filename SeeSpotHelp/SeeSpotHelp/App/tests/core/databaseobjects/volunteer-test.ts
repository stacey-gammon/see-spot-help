import * as React from 'react';
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');
var Promise = require('bluebird');

import Comment from '../../../core/databaseobjects/comment';
import Activity from '../../../core/databaseobjects/activity';
import LoginStore from '../../../stores/loginstore';
import CommentStore from '../../../stores/commentstore';
import ActivityStore from '../../../stores/animalactivitystore';
import VolunteerStore from '../../../stores/volunteerstore';

import TestHelper from '../../testhelper';
import TestData from '../../testdata';

describe("VolunteerTest", function () {

  // it("deleting a user also deletes auth data", function () {
  //   this.timeout(50000);
  //   let email = 'newEmail@t.com';
  //   let pw = 'test1234';
  //   let userId;
  //   return TestHelper.DeleteUser(email, pw)
  //       .then(() => { return LoginStore.signUpWithEmailAndPassword('name', email, pw); })
  //       .then(() => { return LoginStore.ensureUser(); })
  //       .then(() => {
  //         userId = LoginStore.getUser().id;
  //         return LoginStore.getUser().shallowDelete();
  //       }).then(() => { return LoginStore.logout(); })
  //       .then(() => {
  //         return LoginStore.authenticateWithEmailPassword(email, pw);
  //       })
  //       .catch((error) => {
  //         // Thrown error is okay, since we attempted to grab the user's data after deletion.
  //         console.log('error: ', error);
  //       })
  //       .then(() => {
  //         return LoginStore.signUpWithEmailAndPassword('name', email, pw);
  //       })
  //       .then(() => {
  //         return TestHelper.DeleteUser(email, pw);
  //       })
  // });
});
