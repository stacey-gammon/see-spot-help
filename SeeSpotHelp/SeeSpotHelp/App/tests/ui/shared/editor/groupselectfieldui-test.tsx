import * as React from 'react';
var ReactDOM = require("react-dom");
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');

import GroupSelectField from '../../../../core/editor/inputfields/groupselectfield';
import GroupSelectFieldUI from '../../../../ui/shared/editor/groupselectfieldui';
import LoginStore from '../../../../stores/loginstore';
import TestHelper from '../../../testhelper';
import TestData from '../../../testdata';

describe("Group select field's", function () {
  beforeEach(function(done) {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData().then(done);
  });

  afterEach(function(done) {
    this.timeout(100000);

    ReactDOM.unmountComponentAtNode(document.body);
    return TestHelper.DeleteAllTestData().then(done);
  });

  it("default value doesn't change after load", function () {
    this.timeout(50000);
    let secondTestGroupId;
    let firstTestGroupId;
    return TestHelper.CreateTestData()
        .then(() => { return TestHelper.LoginAsAdmin(); })
        .then(() => {
          firstTestGroupId = TestData.testGroupId;
          let secondTestGroup = TestData.GetTestGroup();
          secondTestGroup.name = '2';
          return TestData.InsertTestGroup(secondTestGroup);
        })
        .then(() => {
          // Log out and then back in to reset local data and force the element to pull group
          // information from online.
          secondTestGroupId = TestData.testGroupId;
          return LoginStore.logout();
        })
        .then(() => { return TestHelper.LoginAsAdmin(); })
        .then(() => {
        let groupSelectField = new GroupSelectField();
        groupSelectField.ref = 'groupId';
        groupSelectField.value = secondTestGroupId;

        let GroupSelectFieldUIElement = ReactTestUtils.renderIntoDocument(
          <GroupSelectFieldUI inputField={groupSelectField}/>
        );

        return groupSelectField.populate()
            .then(() => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  expect(GroupSelectFieldUIElement.state.loaded).toEqual(true);
                  let options = ReactTestUtils.scryRenderedDOMComponentsWithTag(
                      GroupSelectFieldUIElement, 'option');
                  expect(options.length).toEqual(2);
                  var groupSelect = ReactDOM.findDOMNode(
                      GroupSelectFieldUIElement.refs.groupId);
                  expect(groupSelect.value).toEqual(secondTestGroupId);
                  resolve();
                }, 1000);
              });
          });
    });
  });

  it("is empty for a user who belongs to no groups", function () {
    this.timeout(50000);
    return TestHelper.LoginAsNonMember().then(() => {
      let groupSelectField = new GroupSelectField();
      let GroupSelectFieldUIElement = ReactTestUtils.renderIntoDocument(
        <GroupSelectFieldUI inputField={groupSelectField}/>
      );

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          expect(GroupSelectFieldUIElement.state.loaded).toEqual(true);
          let options = ReactTestUtils.scryRenderedDOMComponentsWithTag(
              GroupSelectFieldUIElement, 'option');
          expect(options.length).toEqual(0);
          resolve();
        }, 1000);
      });
    });
  });
});
