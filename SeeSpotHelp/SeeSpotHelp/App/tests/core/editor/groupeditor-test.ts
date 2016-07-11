import * as React from 'react';
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');
var Promise = require('bluebird');

import Volunteer from '../../../core/databaseobjects/volunteer';
import Group from '../../../core/databaseobjects/group';
import GroupEditor from '../../../core/editor/groupeditor';
import LoginStore from '../../../stores/loginstore';
import GroupStore from '../../../stores/groupstore';
import TestHelper from '../../testhelper';
import TestData from '../../testdata';

var d3 = require("d3");

function InsertNewGroupWithEditor() : Promise<any> {
  let groupEditor = new GroupEditor(null);
  groupEditor.inputFields['state'].value = 'New York';
  groupEditor.inputFields['city'].value = 'New York City';
  groupEditor.inputFields['zipCode'].value = '12110';
  groupEditor.inputFields['name'].value = 'Test Group';
  groupEditor.inputFields['shelter'].value = 'Test Group Shelter';

  return groupEditor.insert();
}

describe("GroupEditorTest", function () {

  afterEach(function(done) {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData().then(done);
  });

  it("GroupEditorInsertPass", function () {
    console.log('GroupEditorInsertPass');
    LoginStore.logout();
    this.timeout(10000);
    return TestHelper.LoginAsAdmin()
        .then(() => { return InsertNewGroupWithEditor(); })
  });

  it("GroupEditorUpdateFail", function () {
    console.log('GroupEditorUpdateFail');
    this.timeout(10000);
    return new Promise(function(resolve, reject) {
      TestHelper.CreateTestData()
          .then(() => { console.log('Done Creating Test Data'); return TestHelper.LoginAsMember(); })
          .then(() => {
            console.log('Attempging group update');
            let editor = new GroupEditor(TestData.TestGroup);
            editor.inputFields['name'].value = 'Test Group Change';
            return editor.update();
          })
          .catch((error) => {
            console.log('catch group update error');
            expect(error.code).toEqual('PERMISSION_DENIED');
            resolve();
          });
    });
  });
});
