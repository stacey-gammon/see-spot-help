import * as React from 'react';

var expect = require('expect');
var Promise = require('bluebird');

import Comment from '../../core/databaseobjects/comment';
import DatabaseObject from '../../core/databaseobjects/databaseobject';
import DataServices from '../../core/dataservices';
import CommentStore from '../../stores/commentstore';
import TestHelper from '../testhelper';
import TestData from '../testdata';

var d3 = require("d3");

describe("CommentStore", function () {

  beforeEach(function() {
    this.timeout(100000);
    return TestHelper.CreateTestData();
  });

  afterEach(function() {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData();
  });

  // it("A) listens to child_removed raw (Before Insert)", function (done) {
  //   this.timeout(5000);
  //
  //   let ref = DataServices.database.ref();
  //   let pushRef = ref.child('test/testChildRemovedA').push();
  //   let newKey = pushRef.key;
  //   let insertPath = 'test/testChildRemovedA/' + newKey;
  //
  //   let callback = (snapshot) => { done(); }
  //   DataServices.database.ref('test/testChildRemovedA/').on("child_removed", callback);
  //
  //   let updates = {};
  //   updates[insertPath] = 'hi';
  //   DataServices.database.ref().update(updates).then(() => {
  //       updates[insertPath] = null;
  //       DataServices.database.ref().update(updates);
  //     });
  // });
  //
  //
  // it("B) listens to child_removed raw (After Insert)", function (done) {
  //   this.timeout(10000);
  //
  //   let callback = (snapshot) => { done(); }
  //   let ref = DataServices.database.ref();
  //   let pushRef = ref.child('test/testChildRemovedB').push();
  //   let newKey = pushRef.key;
  //   let insertPath = 'test/testChildRemovedB/' + newKey;
  //
  //   let updates = {};
  //   updates[insertPath] = 'hi';
  //   DataServices.database.ref().update(updates).then(() => {
  //       DataServices.database.ref('test/testChildRemovedB/').on("child_removed", callback);
  //       updates[insertPath] = null;
  //       DataServices.database.ref().update(updates);
  //     });
  // });
  //

  it("delete listener called when ensuring items by property", function () {
    this.timeout(50000);
    let commentsLength;

    return CommentStore.ensureItemsByProperty('activityId', TestData.testActivityId)
        .then((comments : Array<Comment>) => {
          expect(comments).toNotEqual(null);
          expect(comments.length).toBeGreaterThan(0);
          commentsLength = comments.length;

          return comments[0].shallowDelete();
        })
        .then(() => {
          return CommentStore.ensureItemsByProperty('activityId', TestData.testActivityId)
        })
        .then((comments : Array<Comment>) => {
          expect(comments).toNotEqual(null);
          expect(comments.length).toEqual(commentsLength - 1);
        });
  });

  it("delete listener called when getting items by property", function (done) {
    this.timeout(50000);
    let commentsLength;

    let getItemsInitially = () => {
      let comments = CommentStore.getItemsByProperty('activityId', TestData.testActivityId);
      expect(comments).toNotEqual(null);
      expect(comments.length).toBeGreaterThan(0);
      commentsLength = comments.length;
      CommentStore.removePropertyListener(this);

      let afterDeleteTriggered = () => {
        let comments = CommentStore.getItemsByProperty('activityId', TestData.testActivityId);
        expect(comments).toNotEqual(null);
        expect(comments.length).toEqual(commentsLength - 1);

        done();
      }

      CommentStore.addPropertyListener(this, 'activityId', TestData.testActivityId, afterDeleteTriggered);
      comments[0].shallowDelete();
    };

    CommentStore.addPropertyListener(this, 'activityId', TestData.testActivityId, getItemsInitially);

    let comments = CommentStore.getItemsByProperty('activityId', TestData.testActivityId);
    if (comments.length > 0) {
      getItemsInitially();
    }
  });
})
