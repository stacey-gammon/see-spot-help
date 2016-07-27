import * as React from 'react';
var expect = require('expect');
var Promise = require('bluebird');

import PermissionsStore from '../stores/permissionsstore';
import TestHelper from './testhelper';
import TestData from './testdata';

describe("DeleteAllTestData", function () {
  it("DeleteAllTestData", function () {
    this.timeout(100000);
    return TestHelper.CreateTestData()
        .then(() => { return TestHelper.DeleteAllTestData(); })
        .then(() => { return TestHelper.LoginAsAdmin(); })
        .then(() => { return PermissionsStore.ensureItemsByProperty('userId', TestData.TestAdminId); })
        .then((permissions) => {
          expect(permissions.length).toEqual(0);
        });
    });
});
