import * as React from 'react';
var ReactDOM = require("react-dom");
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');

import Volunteer from '../../../core/databaseobjects/volunteer';
import Group from '../../../core/databaseobjects/group';
import AddCalendarEvent from '../../../ui/addcalendarevent';
import EditorElement from '../../../ui/shared/editor/editorelement';
import Intro from '../../../ui/intro';
import Utils from '../../../ui/uiutils';
import LoginStore from '../../../stores/loginstore';
import GroupStore from '../../../stores/groupstore';
import PermissionsStore from '../../../stores/permissionsstore';
import TestHelper from '../../testhelper';
import TestData from '../../testdata';

describe("AddCalendarEventTests", function () {
  afterEach(function(done) {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData().then(done);
  });

  it("AddEventOnPersonalCalendarNoGroups", function () {
    this.timeout(50000);
    return TestHelper.LoginAsNonMember().then(() => {
      let addCalendarEventElement = ReactTestUtils.renderIntoDocument(
        <AddCalendarEvent />
      );

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          expect(addCalendarEventElement.state.loading).toEqual(false);
          ReactTestUtils.findRenderedComponentWithType(addCalendarEventElement, EditorElement);
          ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(addCalendarEventElement).parentNode);
          resolve();
        }, 1000);
      });
    });
  });

    it("Loads the right group in the drop down ", function () {
      this.timeout(50000);
      let secondTestGroup;
      return TestHelper.CreateTestData()
          .then(() => { return TestHelper.LoginAsAdmin(); })
          .then(() => {
            secondTestGroup = TestData.GetTestGroup();
            secondTestGroup.name = '2';
            return TestData.InsertTestGroup(secondTestGroup);
          })
          .then(() => {
            return PermissionsStore.ensureItemsByProperty('userId', LoginStore.getUser().id);
          })
          .then((permissions) => {
              expect(permissions.length).toEqual(2);
              return GroupStore.getItemById(permissions[1].groupId);
          })
          .then((group) => {
              let addCalendarEventElement = ReactTestUtils.renderIntoDocument(
                <AddCalendarEvent group={group} />
              );

              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  expect(addCalendarEventElement.state.loading).toEqual(false);
                  let editorElement = ReactTestUtils.findRenderedComponentWithType(
                      addCalendarEventElement, EditorElement);

                  var groupSelect = ReactDOM.findDOMNode(
                      editorElement.refs.inputFields.refs.groupId.refs.groupId.refs.groupId);

                  expect(groupSelect.value).toEqual(group.id);

                  ReactDOM.unmountComponentAtNode(
                      ReactDOM.findDOMNode(addCalendarEventElement).parentNode);
                  resolve();
                }, 1000);
              });
          });
    });
});
