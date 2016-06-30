import * as React from 'react';
var ReactDOM = require("react-dom");
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');
var Promise = require('bluebird');

var ServerResponse = require("../../../core/serverresponse");

import Volunteer from '../../../core/databaseobjects/volunteer';
import Group from '../../../core/databaseobjects/group';
import GroupEditor from '../../../core/editor/groupeditor';
import AddNewGroup from '../../../ui/group/addnewgroup';
import LoginStore from '../../../stores/loginstore';
import TestHelper from '../../testhelper';

var d3 = require("d3");

describe("GroupEditorTest", function () {
  it("GroupEditorUnauthorizedUserPermissionFail", function (done) {
    let user = new Volunteer("john", "doe");
    LoginStore.user = user;

    let groupEditor = new GroupEditor(null);
    groupEditor.inputFields['state'].value = 'New York';
    groupEditor.inputFields['city'].value = 'New York City';
    groupEditor.inputFields['zipCode'].value = '12110';
    groupEditor.inputFields['name'].value = 'Test Group';
    groupEditor.inputFields['shelter'].value = 'Test Group Shelter';

    let promise = groupEditor.insert({userId: '123'});
    return new Promise(function(resolve, reject) {
      promise.then(function() {
        expect(true).toEqual(false);
        reject();
        done();
      }).catch(function(error) {
        expect(error.code).toEqual('PERMISSION_DENIED');
        resolve();
        done();
      });
    });
  });

  it("GroupEditorInsertPass", function (done) {
    LoginStore.user = null;
    return new Promise(function(resolve, reject) {
      TestHelper.LoginWithTestAccount().then(function() {
        let groupEditor = new GroupEditor(null);
        groupEditor.inputFields['state'].value = 'New York';
        groupEditor.inputFields['city'].value = 'New York City';
        groupEditor.inputFields['zipCode'].value = '12110';
        groupEditor.inputFields['name'].value = 'Test Group';
        groupEditor.inputFields['shelter'].value = 'Test Group Shelter';

        let promise = groupEditor.insert({userId: LoginStore.getUser().id});
        promise.then(function() {
          resolve();
          done();
          return groupEditor.delete();
        }).catch(function(error) {
          reject();
          done();
        });
      });
    });
  });

  it("GroupEditorUpdate", function (done) {
    LoginStore.user = null;
    return new Promise(function(resolve, reject) {
      TestHelper.LoginWithTestAccount().then(function() {
        let groupEditor = new GroupEditor(null);
        groupEditor.inputFields['state'].value = 'New York';
        groupEditor.inputFields['city'].value = 'New York City';
        groupEditor.inputFields['zipCode'].value = '12110';
        groupEditor.inputFields['name'].value = 'Test Group';
        groupEditor.inputFields['shelter'].value = 'Test Group Shelter';

        let promise = groupEditor.insert({userId: LoginStore.getUser().id});
        promise.then(function() {
          LoginStore.user = null;
          TestHelper.LoginWithTestAccount2().then(function() {
            groupEditor.inputFields['state'].value = 'New Jersey';
            groupEditor.update().catch(function(error) {
              expect(error.code).toEqual('PERMISSION_DENIED');
              // Clean up the test account.
              LoginStore.user = null;
              TestHelper.LoginWithTestAccount().then(function() {
                resolve();
                done();
                return groupEditor.delete();
              });
            });
          });
        }).catch(function(error) {
          reject();
          done();
        });
      });
    });
  });

});
