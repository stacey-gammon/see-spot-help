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
import TestData from '../../testdata';

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
      TestHelper.CreateTestData()
          .then(function() { TestHelper.LoginAsAdmin()
          .then(function() {
            let comment = new Comment();
            comment.activityId = TestData.testActivityId;
            comment.groupId = TestData.testGroupId;
            comment.userId = LoginStore.getUser().id;

            comment.insert().then(function() {
              resolve();
              TestHelper.DeleteTestData();
              comment.shallowDelete();
              done();
            });
          });
      });
      });
    });
  });

  it("CommentAddTestNotAuthorized", function (done) {
    this.timeout(7000);
    return new Promise(function(resolve, reject) {
      TestHelper.CreateTestData()
          .then(function() { TestHelper.LoginAsAdmin()
          .then(function() { TestHelper.LoginAsNonMember()
          .then(function() {
            let comment = new Comment();
            comment.activityId = TestData.testActivityId;
            comment.groupId = TestData.testGroupId;
            comment.userId = LoginStore.getUser().id;

            comment.insert().then(function() {
              reject();
              TestHelper.DeleteTestData();
              comment.shallowDelete();
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
