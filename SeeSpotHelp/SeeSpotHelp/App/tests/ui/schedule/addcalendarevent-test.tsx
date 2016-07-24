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
          resolve();
        }, 1000);
      });
    });
  });
});
