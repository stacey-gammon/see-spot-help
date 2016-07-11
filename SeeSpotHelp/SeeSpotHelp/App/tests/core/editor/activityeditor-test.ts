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
  it("DeleteActivityTest", function (done) {
    console.log('DeleteActivityTest');
    this.timeout(10000);
    TestHelper.LoginAsAdmin()
        .then(function() { TestHelper.CreateTestData()
        .then(function() { ActivityStore.ensureItemById(TestData.testActivityId)
        .then(function() {
          let activity = ActivityStore.getItemById(TestData.testActivityId);
          let activityEditor = new ActivityEditor(activity);

          return new Promise(function(resolve, reject) {
            activityEditor.delete().then(function() {
              let promises = [
                  TestHelper.ExpectItemIsDeleted(TestData.testActivityId, ActivityStore)];//,
                //  TestHelper.ExpectItemIsDeleted(TestData.testAdminCommentId, CommentStore),
              //    TestHelper.ExpectItemIsDeleted(TestData.testMemberCommentId, CommentStore)];

              Promise.all(promises).then(function() { resolve(); done(); }, reject);
            },
            function(error) {
              console.log('error: ', error);
              reject();
            });
        });
        });
        });
    });
  });
});
