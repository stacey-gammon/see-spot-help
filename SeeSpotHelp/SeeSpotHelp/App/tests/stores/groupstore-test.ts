import * as React from 'react';

var expect = require('expect');
var Promise = require('bluebird');

import PermissionStore from '../../stores/permissionsstore';
import Group from '../../core/databaseobjects/group';
import GroupEditor from '../../core/editor/groupeditor';
import GroupStore from '../../stores/groupstore';
import TestHelper from '../testhelper';
import TestData from '../testdata';

var d3 = require("d3");

describe("GroupStoreTest", function () {

  beforeEach(function(done) {
    this.timeout(100000);
    return TestHelper.CreateTestData().then(done);
  });

  afterEach(function(done) {
    this.timeout(100000);
    TestHelper.DeleteAllTestData().then(done);
  });

  it("GroupStoreGetItemChangeListener", function () {
    this.timeout(50000);
    // Getting the item by id should add listeners for that item.
    return GroupStore.ensureItemById(TestData.TestGroup.id)
        .then((group: Group) => {
          expect(group).toNotEqual(null);
          group.name = 'New Group Name';
          return group.update();
        })
        .then(() => {
          let group = GroupStore.getItemById(TestData.TestGroup.id);
          expect(group).toNotEqual(null);
          expect(group.name).toEqual('New Group Name');
        }, (error) => {
          console.log('GroupStoreGetItemChangeListener Error Caught: ', error);
          expect(true).toEqual(false);
          throw error;
        });
  });

  it("GroupStoreGetItemDeleteListener", function () {
    this.timeout(50000);
    // Getting the item by id should add listeners for that item.
    return GroupStore.ensureItemById(TestData.TestGroup.id)
        .then((group : Group) => {
          expect(group).toNotEqual(null);
          return new GroupEditor(group).delete();
        })
        .then(() => {
          console.log('GroupStoreGetItemDeleteListener: Group Deleted');
          let group = GroupStore.getItemById(TestData.TestGroup.id);
          expect(group).toEqual(null);
        }, (error) => {
          console.log('GroupStoreGetItemDeleteListener Error Caught: ', error);
          expect(true).toEqual(false);
          throw error;
        });
  });
})
