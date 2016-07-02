import * as React from 'react';
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');
var Promise = require('bluebird');

import Comment from '../../../core/databaseobjects/comment';
import Activity from '../../../core/databaseobjects/activity';
import LoginStore from '../../../stores/loginstore';
import CommentStore from '../../../stores/commentstore';
import ActivityStore from '../../../stores/animalactivitystore';

import TestHelper from '../../testhelper';

describe("CommentTest", function () {

  beforeEach(() => {
    LoginStore.logout();
  });

  afterEach(() => {
    LoginStore.logout();
  });

  it("CommentAddTest", function (done) {
    this.timeout(7000);
    return new Promise(function(resolve, reject) {
      TestHelper.LoginWithTestAccount()
          .then(function() { TestHelper.CreateTestData()
          .then(function() {
            let comment = new Comment();
            comment.activityId = TestHelper.testActivityId;
            comment.groupId = TestHelper.testGroupId;
            comment.userId = LoginStore.getUser().id;

            comment.insert().then(function() {
              resolve();
              TestHelper.DeleteTestData();
              comment.delete();
              done();
            });
          });
      });
    });
  });

  it("CommentAddTestNotAuthorized", function (done) {
    this.timeout(7000);
    return new Promise(function(resolve, reject) {
      TestHelper.LoginWithTestAccount()
        .then(function() { TestHelper.CreateTestData()
        .then(function() {
          TestHelper.LoginWithTestAccount2().then(function() {
            let comment = new Comment();
            comment.activityId = TestHelper.testActivityId;
            comment.groupId = TestHelper.testGroupId;
            comment.userId = LoginStore.getUser().id;

            comment.insert().then(function() {
              reject();
              TestHelper.DeleteTestData();
              comment.delete();
            }, function(error) {
              resolve();
              TestHelper.DeleteTestData();
              done();
            });
        });
        });
      });
    });
  });
});
