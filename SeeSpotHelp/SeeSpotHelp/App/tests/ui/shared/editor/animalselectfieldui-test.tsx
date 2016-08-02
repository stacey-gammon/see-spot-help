import * as React from 'react';
var ReactDOM = require("react-dom");
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');

import AnimalSelectField from '../../../../core/editor/inputfields/animalselectfield';
import AnimalSelectFieldUI from '../../../../ui/shared/editor/animalselectfieldui';
import TestHelper from '../../../testhelper';
import TestData from '../../../testdata';

describe("Animal select field", function () {
  afterEach(function(done) {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData().then(done);
  });

  it("is loaded with animals", function () {
    this.timeout(50000);
    return TestHelper.CreateTestData()
      .then(() => { return TestHelper.LoginAsAdmin(); })
      .then(() => {
        let animalSelectField = new AnimalSelectField();
        let AnimalSelectFieldUIElement = ReactTestUtils.renderIntoDocument(
          <AnimalSelectFieldUI inputField={animalSelectField}/>
        );

        return animalSelectField.populate(TestData.TestGroup.id)
            .then(() => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  expect(AnimalSelectFieldUIElement.state.loaded).toEqual(true);
                  let options = ReactTestUtils.scryRenderedDOMComponentsWithTag(
                      AnimalSelectFieldUIElement, 'option');
                  expect(options.length).toEqual(1);
                  resolve();
                }, 1000);
              });
          });
    });
  });

  it("is empty for a user who belongs to no groups", function () {
    this.timeout(50000);
    return TestHelper.LoginAsNonMember().then(() => {
      let animalSelectField = new AnimalSelectField();
      let AnimalSelectFieldUIElement = ReactTestUtils.renderIntoDocument(
        <AnimalSelectFieldUI inputField={animalSelectField}/>
      );

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          expect(AnimalSelectFieldUIElement.state.loaded).toEqual(true);
          let options = ReactTestUtils.scryRenderedDOMComponentsWithTag(
              AnimalSelectFieldUIElement, 'option');
          expect(options.length).toEqual(0);
          resolve();
        }, 1000);
      });
    });
  });
});
