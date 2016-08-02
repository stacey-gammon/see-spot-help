import * as React from 'react';

var expect = require('expect');
var Promise = require('bluebird');

import AnimalStore from '../../stores/animalstore';
import Group from '../../core/databaseobjects/group';
import GroupEditor from '../../core/editor/groupeditor';
import GroupStore from '../../stores/groupstore';
import LoginStore from '../../stores/loginstore';
import TestHelper from '../testhelper';
import TestData from '../testdata';

describe("AnimalStoreTest", function () {

  beforeEach(function() {
    this.timeout(100000);
    return TestHelper.CreateTestData();
  });

  afterEach(function() {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData();
  });

  // Makes sure listeners are added when starting with no animals (from a bug that was found).
  it("AnimalStoreTestAddItemListeners", function () {
    this.timeout(50000);

    return TestHelper.DeleteAllTestData()
        .then(() => { return TestHelper.LoginAsAdmin(); })
        .then(() => { return TestData.InsertTestGroup(); })
        .then((group) => {
          return AnimalStore.ensureItemsByProperty('groupId', TestData.testGroupId);
        })
        .then((animals) => {
          expect(animals.length).toEqual(0);
          return TestData.InsertTestAnimal(TestData.testGroupId);
        })
        .then(() => {
          let animals = AnimalStore.getItemsByProperty('groupId', TestData.testGroupId);
          expect(animals.length).toEqual(1);
        })
  });
})
