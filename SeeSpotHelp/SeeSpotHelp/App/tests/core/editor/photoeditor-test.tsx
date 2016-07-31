import * as React from 'react';
var expect = require('expect');
var Promise = require('bluebird');

import Photo from '../../../core/databaseobjects/photo';
import PhotoStore from '../../../stores/photostore';
import PhotoEditor from '../../../core/editor/photoeditor';
import LoginStore from '../../../stores/loginstore';
import TestHelper from '../../testhelper';
import TestData from '../../testdata';

describe("Photo Editor", function () {

  beforeEach(function() {
    this.timeout(50000);
    return TestHelper.CreateTestData();
  });

  afterEach(function() {
    this.timeout(50000);
    return TestHelper.DeleteAllTestData();
  });

  it("inserts a photo", function () {
    this.timeout(50000);

    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:9876/favicon.ico', true);
      xhr.responseType = 'blob';
      xhr.onload = function(e) {
        if (this.status == 200) {
          var photoBlob = this.response;
          let photo = new Photo();
          photo.file = photoBlob;
          photo.userId = LoginStore.getUser().id;
          let editor = new PhotoEditor(photo);
          editor.insert({userId: LoginStore.getUser().id}).then((photo) => {
            expect(photo).toNotEqual(null);
            resolve();
          });
        }
      };
      xhr.send();
    });
  });
});
