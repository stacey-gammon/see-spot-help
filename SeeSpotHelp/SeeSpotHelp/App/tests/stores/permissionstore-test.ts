import * as React from 'react';

var expect = require('expect');
var Promise = require('bluebird');

import PermissionStore from '../../stores/permissionsstore';
import Group from '../../core/databaseobjects/group';
import GroupStore from '../../stores/groupstore';
import TestHelper from '../testhelper';
import TestData from '../testdata';

var d3 = require("d3");

describe("PermissionStoreTest", function () {

  beforeEach(function(done) {
    this.timeout(100000);
    TestHelper.CreateTestData().then(done);
  });

  afterEach(function(done) {
    this.timeout(100000);
    TestHelper.DeleteAllTestData().then(done);
  });

  it("PermissionStoreGetItemChildAddedListener", function () {
    this.timeout(50000);
    let insertedGroupId;
    return TestHelper.CreateTestData()
        .then(() => {
          return PermissionStore.ensureItemsByProperty('userId', TestData.TestAdminId);
        })
        .then(() => {
          let group = new Group();
          group.name = 'my test group 2';
          return group.insert();
        })
        .then((insertedGroup) => {
          insertedGroupId = insertedGroup.id;
          return PermissionStore.ensureItemsByProperty('userId', TestData.TestAdminId);
        })
        .then((permissions) => {
          let found = false;
          for (let i = 0; i < permissions.length; i++) {
            if (permissions[i].groupId == insertedGroupId) {
              found = true;
              break;
            }
          }
          expect(found).toEqual(true);
        })
        .catch((error) => {
          console.log('Caught error during PermissionStoreGetItemChildAddedListener:', error);
          expect(error).toEqual(null);
          throw error;
        });
  });
})
