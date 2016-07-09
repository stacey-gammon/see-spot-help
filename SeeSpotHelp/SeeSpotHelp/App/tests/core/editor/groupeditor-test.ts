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

var d3 = require("d3");

describe("GroupEditorTest", function () {
  it("GroupEditorUnauthorizedUserPermissionFail", function (done) {
    let user = new Volunteer("john", "doe");
    user.id = '123';
    LoginStore['user'] = user;

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
    LoginStore.logout();
    this.timeout(5000);
    return new Promise(function(resolve, reject) {
      TestHelper.LoginAsAdmin().then(function() {
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
    LoginStore.logout();
    this.timeout(10000);
    return new Promise(function(resolve, reject) {
      TestHelper.LoginAsAdmin().then(function() {
        let groupEditor = new GroupEditor(null);
        groupEditor.inputFields['state'].value = 'New York';
        groupEditor.inputFields['city'].value = 'New York City';
        groupEditor.inputFields['zipCode'].value = '12110';
        groupEditor.inputFields['name'].value = 'Test Group';
        groupEditor.inputFields['shelter'].value = 'Test Group Shelter';

        let promise = groupEditor.insert({userId: LoginStore.getUser().id});
        promise.then(function() {
          LoginStore.logout();
          TestHelper.LoginAsNonMember().then(function() {
            groupEditor.inputFields['state'].value = 'New Jersey';
            groupEditor.update().catch(function(error) {
              expect(error.code).toEqual('PERMISSION_DENIED');
              // Clean up the test account.
              LoginStore.logout();
              TestHelper.LoginAsAdmin().then(function() {
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

  // it("DeleteGroupTest", function (done) {
  //   this.timeout(10000);
  //   TestHelper.LoginWithTestAccount()
  //       .then(function() { TestHelper.CreateTestData()
  //       .then(function() { GroupStore.ensureItemById(TestHelper.testGroupId)
  //       .then(function() {
  //         let group = GroupStore.getItemById(TestHelper.testGroupId);
  //         let editor = new GroupEditor(group);
  //
  //         return new Promise(function(resolve, reject) {
  //           editor.delete().then(function() {
  //             GroupStore.ensureItemById(TestHelper.testGroupId).then(function() {
  //               let group = GroupStore.getItemById(TestHelper.testGroupId);
  //               expect(group).toEqual(null);
  //               if (!group) {
  //                 resolve();
  //                 done();
  //               } else {
  //                 reject();
  //               }
  //             }, reject);
  //           },
  //           function(error) {
  //             console.log('error: ', error);
  //             reject();
  //           });
  //       });
  //       });
  //       });
  //   });
  // });

});
