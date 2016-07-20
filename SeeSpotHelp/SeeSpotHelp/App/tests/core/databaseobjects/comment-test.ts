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

  beforeEach(function() {
    this.timeout(100000);
    return TestHelper.CreateTestData();
  });

  afterEach(function() {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData();
  });

  it("CommentAddTest", function () {
    console.log('CommentAddTest');
    this.timeout(50000);
    return TestHelper.LoginAsAdmin()
        .then(() => {
          let comment = new Comment();
          comment.activityId = TestData.testActivityId;
          comment.groupId = TestData.testGroupId;
          comment.userId = LoginStore.getUser().id;

          return comment.insert();
        })
        .then((comment) => { return comment.shallowDelete(); });
  });

  it("CommentAddTestNotAuthorized", function () {
    console.log('CommentAddTestNotAuthorized');
    this.timeout(50000);
    return TestHelper.LoginAsNonMember()
        .then(() => {
          let comment = new Comment();
          comment.activityId = TestData.testActivityId;
          comment.groupId = TestData.testGroupId;
          comment.userId = LoginStore.getUser().id;

          return comment.insert();
        })
        .then((comment) => {
          expect(false).toEqual(true);
          return comment.shallowDelete();
        })
        .catch((error) => {
          expect(error.code).toEqual('PERMISSION_DENIED');
        });
    });
});
