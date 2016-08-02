import * as React from 'react';
var ReactDOM = require("react-dom");
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');

import CommentStore from '../../../../stores/commentstore';
import LoginStore from '../../../../stores/loginstore';
import Comments from '../../../../ui/shared/activity/comments';
import Permission from '../../../../core/databaseobjects/permission';
import TestHelper from '../../../testhelper';
import TestData from '../../../testdata';

describe("Comment boxes", function () {
  afterEach(function(done) {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData().then(done);
  });

  it("can be deleted", function () {
    this.timeout(50000);
    let commentsTotal;
    let CommentsForActivityUI;
    return TestHelper.CreateTestData()
      .then(() => { return TestHelper.LoginAsAdmin(); })
      .then(() => {
        return CommentStore.ensureItemsByProperty('activityId', TestData.testActivityId);
      })
      .then((comments) => {
        expect(comments).toNotEqual(null);
        expect(comments.length).toBeGreaterThan(0);
        commentsTotal = comments.length;
        let permission = Permission.CreateAdminPermission(LoginStore.getUser().id, TestData.testGroupId);

        CommentsForActivityUI = ReactTestUtils.renderIntoDocument(
          <Comments activityId={TestData.testActivityId}
                    permission={permission}
                    groupId={TestData.testGroupId} />
        );

        return CommentsForActivityUI.deleteAction(comments[0]);
      })
      .then(() => { return CommentStore.ensureItemsByProperty('activityId', TestData.testActivityId); })
      .then((comments) => {
        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(CommentsForActivityUI).parentNode);
        expect(comments).toNotEqual(null);
        expect(comments.length).toEqual(commentsTotal - 1);
      });
  });

});
