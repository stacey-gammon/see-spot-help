import * as React from 'react';

var expect = require('expect');
var Promise = require('bluebird');

import PermissionStore from '../../stores/permissionsstore';
import Group from '../../core/databaseobjects/group';
import GroupStore from '../../stores/groupstore';
import LoginStore from '../../stores/loginstore';
import TestHelper from '../testhelper';
import TestData from '../testdata';

var d3 = require("d3");

describe("PermissionStoreTest", function () {

  beforeEach(function() {
    this.timeout(100000);
    return TestHelper.CreateTestData();
  });

  afterEach(function() {
    console.log('PermissionStoreTest: After Each');
    this.timeout(100000);
    return TestHelper.DeleteAllTestData().then(() => {

        console.log('PermissionStoreTest: Finished After Each (delete all test data)');
    });
  });

  it("PermissionStoreGetItemChildAddedListener", function () {
    console.log('PermissionStoreGetItemChildAddedListener');
    this.timeout(50000);
    return PermissionStore.ensureItemsByProperty('userId', LoginStore.getUser().id)
        .then(() => {
          let group = new Group();
          group.name = 'my test group 2';
          console.log('PermissionStoreGetItemChildAddedListener: inserting a group');
          return group.insert();
        })
        .then((insertedGroup) => {
          console.log('PermissionStoreGetItemChildAddedListener: Checking inserted group');
          let permissions = PermissionStore.getItemsByProperty('userId', LoginStore.getUser().id);
          let found = false;
          for (let i = 0; i < permissions.length; i++) {
            if (permissions[i].groupId == insertedGroup.id) {
              found = true;
              break;
            }
          }
          expect(found).toEqual(true);
        })
        .catch((error) => {
          console.log('Caught error during PermissionStoreGetItemChildAddedListener: ', error);
          expect(error).toEqual(null);
          throw error;
        });
  });
})
