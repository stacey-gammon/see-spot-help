import * as React from 'react';

var expect = require('expect');
var Promise = require('bluebird');

import DataServices from '../../core/dataservices';
import TestHelper from '../testhelper';
import TestData from '../testdata';

describe("DataServices", function () {

  it("listens to child_added", function (done) {
    this.timeout(5000);

    let callback = (snapshot) => { done(); }
    DataServices.OnChildAdded('test/testChildAdded', callback);

    let newKey = DataServices.GetNewPushKey('/test/testChildAdded');
    let insertPath = '/test/testChildAdded/' + newKey;
    let inserts = {};
    inserts[insertPath] = {'data': 'd'};

    DataServices.UpdateMultiple(inserts);
  });

  it("listens to child_removed raw", function (done) {
    this.timeout(5000);

    let callback = (snapshot) => { done(); }

    let database = DataServices.database;
    let ref = database.ref();
    let pushRef = ref.child('test/testChildRemoved').push();
    let newKey = pushRef.key;
    let insertPath = 'test/testChildRemoved/' + newKey;

    database.ref('test/testChildRemoved').on("child_removed", callback);

    let updates = {};
    updates[insertPath] = 'hi';
    database.ref().update(updates).then(() => {
        updates[insertPath] = null;
        database.ref().update(updates);
      });
  });


  it("listens to child_removed", function (done) {
    this.timeout(5000);

    let callback = (snapshot) => { done(); }

    let database = DataServices.database;
    let ref = database.ref();
    DataServices.OnChildRemoved('test/testChildRemoved', callback);

    let newKey = DataServices.GetNewPushKey('/test/testChildRemoved');
    let insertPath = '/test/testChildRemoved/' + newKey;
    let insertPath2 = '/test/test2/' + newKey;
    let inserts = {};
    inserts[insertPath] = {'data': 'd'};
    inserts[insertPath2] = {'data': 'd'};

    DataServices.UpdateMultiple(inserts)
        .then(() => {
          let deletes = {};
          deletes[insertPath + '/'] = null;
          deletes[insertPath2 + '/'] = null;
          //inserts[insertPath] = null;
          DataServices.UpdateMultiple(deletes);
        });
  });
})
