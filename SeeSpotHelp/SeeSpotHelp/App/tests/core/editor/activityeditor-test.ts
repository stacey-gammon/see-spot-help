import * as React from 'react';
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');
var Promise = require('bluebird');

import ActivityStore from '../../../stores/animalactivitystore';
import CommentStore from '../../../stores/commentstore';
import ActivityEditor from '../../../core/editor/activityeditor';
import LoginStore from '../../../stores/loginstore';
import TestHelper from '../../testhelper';
import TestData from '../../testdata';

var d3 = require("d3");

describe("ActivityEditorTest", function () {

  beforeEach(function(done) {
    this.timeout(100000);
    TestHelper.CreateTestData().then(done);
  });

  afterEach(function(done) {
    this.timeout(100000);
    TestHelper.DeleteAllTestData().then(done);
  });

  it("DeleteActivityTest", function () {
    console.log('DeleteActivityTest');
    this.timeout(50000);
    return ActivityStore.ensureItemById(TestData.testActivityId)
        .then(() => {
          let activity = ActivityStore.getItemById(TestData.testActivityId);
          let activityEditor = new ActivityEditor(activity);

          return activityEditor.delete();
        })
        .then(() => {
          let promises = [
              TestHelper.ExpectItemIsDeleted(TestData.testActivityId, ActivityStore)];//,
            //  TestHelper.ExpectItemIsDeleted(TestData.testAdminCommentId, CommentStore),
          //    TestHelper.ExpectItemIsDeleted(TestData.testMemberCommentId, CommentStore)];

          return Promise.all(promises);
        });
  });
});
