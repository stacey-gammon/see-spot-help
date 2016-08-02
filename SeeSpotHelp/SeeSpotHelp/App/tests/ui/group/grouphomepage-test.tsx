import * as React from 'react';
var ReactDOM = require("react-dom");
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');

import Volunteer from '../../../core/databaseobjects/volunteer';
import Group from '../../../core/databaseobjects/group';
import GroupHomePage from '../../../ui/group/grouphomepage';
import GroupInfoBar from '../../../ui/group/groupinfobar';
import Intro from '../../../ui/intro';
import Utils from '../../../ui/uiutils';
import LoginStore from '../../../stores/loginstore';
import TestHelper from '../../testhelper';
import TestData from '../../testdata';

describe("Group home page", function () {
  afterEach(function() {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData();
  });

  it("listens for user logging in event ", function () {
    this.timeout(50000);
    let GroupHomePageElement;
    return TestHelper.CreateTestData()
        .then(() => { return LoginStore.logout(); })
        .then(() => {
          Utils.SaveProp('groupId', TestData.testGroupId);
          GroupHomePageElement = ReactTestUtils.renderIntoDocument(
            <GroupHomePage/>
          );
          expect(GroupHomePageElement.state.loading).toEqual(true);
          return TestHelper.LoginAsAdmin();
        })
        .then(() => {
          return new Promise((resolve, reject) => {
            // Give time for the group to load, though it should be local so take pretty much no time.
            setTimeout(() => {
              expect(GroupHomePageElement.state.loading).toEqual(false);
              ReactTestUtils.findRenderedComponentWithType(GroupHomePageElement, GroupInfoBar);
              ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(GroupHomePageElement).parentNode);
              resolve();
            }, 1000);
          });
        });
  });

  it("loads a group", function () {
    this.timeout(50000);
    return TestHelper.CreateTestData().then(() => {
      Utils.SaveProp('groupId', TestData.testGroupId);
      let GroupHomePageElement = ReactTestUtils.renderIntoDocument(
        <GroupHomePage/>
      );

      return new Promise((resolve, reject) => {
        // Give time for the group to load, though it should be local so take pretty much no time.
        setTimeout(() => {
          expect(GroupHomePageElement.state.loading).toEqual(false);
          ReactTestUtils.findRenderedComponentWithType(GroupHomePageElement, GroupInfoBar);
          ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(GroupHomePageElement).parentNode);
          resolve();
        }, 1000);
      });
    });
  });

  it("loads intro page when user does not belong to a group", function () {
    this.timeout(50000);
    return TestHelper.LoginAsNonMember().then(() => {
      Utils.SaveProp('groupId', 'nogroupidofthisexists');
      let GroupHomePageElement = ReactTestUtils.renderIntoDocument(
        <GroupHomePage/>
      );

      return new Promise((resolve, reject) => {
        // Give time for the group to attempt to load and fail.
        setTimeout(() => {
          expect(GroupHomePageElement.state.loading).toEqual(false);
          ReactTestUtils.findRenderedComponentWithType(GroupHomePageElement, Intro);
          ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(GroupHomePageElement).parentNode);
          resolve();
        }, 1000);
      });
    });
  });
});
