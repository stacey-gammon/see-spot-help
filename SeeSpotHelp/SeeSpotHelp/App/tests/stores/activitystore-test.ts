import * as React from 'react';

var expect = require('expect');
var Promise = require('bluebird');

import ActivityStore from '../../stores/activitystore';
import Group from '../../core/databaseobjects/group';
import LoginStore from '../../stores/loginstore';
import TestHelper from '../testhelper';
import TestData from '../testdata';

describe("Activity Store", function () {

  beforeEach(function() {
    this.timeout(100000);
    return TestHelper.CreateTestData();
  });

  afterEach(function() {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData();
  });

  it("Downloads less than requested with paging", function () {
    this.timeout(50000);

    return TestHelper.LoginAsAdmin()
        .then(() => {
          return ActivityStore.ensureItemsByProperty('groupId', TestData.testGroupId, 10);
        })
        .then((activities) => {
          expect(activities.length).toEqual(1);
        // Run it again to make sure it works as expected even after the initial download.
          return ActivityStore.ensureItemsByProperty('groupId', TestData.testGroupId, 10);
        })
        .then((activities) => {
          expect(activities.length).toEqual(1);
        })
  });

  it("Multiple downloads at the same time succeed", function () {
    this.timeout(50000);

    return TestHelper.LoginAsAdmin()
        .then(() => {
          ActivityStore.getItemsByProperty('groupId', TestData.testGroupId, 10);
          return Promise.all([
              ActivityStore.ensureItemsByProperty('groupId', TestData.testGroupId, 10),
              ActivityStore.ensureItemsByProperty('groupId', TestData.testGroupId, 10),
              ActivityStore.ensureItemsByProperty('groupId', TestData.testGroupId, 10)]);
        })
        .then((results) => {
          for (let i = 0; i < results.length; i++) {
            expect(results[i].length).toEqual(1);
          }
        });
  });

  it("requesting data, then downloading, then requesting with length limit", function () {
    this.timeout(50000);

    return TestHelper.LoginAsAdmin()
        .then(() => {
          ActivityStore.getItemsByProperty('groupId', TestData.testGroupId, 10);
          return ActivityStore.ensureItemsByProperty('groupId', TestData.testGroupId, 10);
        })
        .then((activity) => {
          expect(activity.length).toEqual(1);
          return TestData.InsertTestActivity(TestData.testGroupId, TestData.testAnimalId);
        })
        .then(() => {
            return ActivityStore.ensureItemsByProperty('groupId', TestData.testGroupId, 10);
        })
        .then((activity) => {
          expect(activity.length).toEqual(2);
        });
  });

  it("Initial insert successfully tracked", function () {
    this.timeout(50000);

    return TestHelper.LoginAsAdmin()
        .then(() => { return TestData.InsertTestGroup(TestData.GetTestGroup()); })
        .then(() => {
          return TestData.InsertTestAnimal(TestData.testGroupId);
        })
        .then(() => {
          ActivityStore.getItemsByProperty('animalId', TestData.testAnimalId, 10);
          return ActivityStore.ensureItemsByProperty('animalId', TestData.testAnimalId, 10);
        })
        .then((activity) => {
          expect(activity.length).toEqual(0);
          return TestData.InsertTestActivity(TestData.testGroupId, TestData.testAnimalId);
        })
        .then(() => {
            return ActivityStore.ensureItemsByProperty('animalId', TestData.testAnimalId, 10);
        })
        .then((activity) => {
          expect(activity.length).toEqual(1);
        });
  });
})
