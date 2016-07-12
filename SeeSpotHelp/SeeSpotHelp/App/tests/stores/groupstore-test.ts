import * as React from 'react';

var expect = require('expect');
var Promise = require('bluebird');

import PermissionStore from '../../stores/permissionsstore';
import Group from '../../core/databaseobjects/group';
import GroupStore from '../../stores/groupstore';
import TestHelper from '../testhelper';
import TestData from '../testdata';

var d3 = require("d3");

describe("GroupStoreTest", function () {

  beforeEach(function(done) {
    this.timeout(100000);
    TestHelper.CreateTestData().then(done);
  });

  afterEach(function(done) {
    this.timeout(100000);
    TestHelper.DeleteAllTestData().then(done);
  });

  it("GroupStoreGetItemChangeListener", function () {
    this.timeout(50000);
    // Getting the item by id should add listeners for that item.
    GroupStore.ensureItemById(TestData.TestGroup.id)
        .then((group: Group) => {
          expect(group).toNotEqual(null);
          group.name = 'New Group Name';
          return group.update();
        })
        .then(() => {
          let group = GroupStore.getItemById(TestData.TestGroup.id);
          expect(group).toNotEqual(null);
          expect(group.name).toEqual('New Group Name');
        });
  });

  it("GroupStoreGetItemDeleteListener", function () {
    this.timeout(50000);
    TestHelper.CreateTestData()
        .then(() => {
          // Getting the item by id should add listeners for that item.
          let group = GroupStore.getItemById(TestData.TestGroup.id);
          expect(group).toNotEqual(null);
          return group.delete();
        })
        .then(() => {
          let group = GroupStore.getItemById(TestData.TestGroup.id);
          expect(group).toEqual(null);
        });
  });

  it("GroupStoreGetItemChildAddedListener", function () {
    this.timeout(50000);
    TestHelper.CreateTestData()
        .then(() => GroupStore.ensureItemsByProperty('userId', TestData.TestAdminId))
        .then(() => {
          let group = new Group();
          group.name = 'my test group 2';
          return group.insert();
        })
        .then((insertedGroup) => {
          let group = GroupStore.getItemById(insertedGroup.id);
          expect(group).toNotEqual(null);
        });
  });
})
