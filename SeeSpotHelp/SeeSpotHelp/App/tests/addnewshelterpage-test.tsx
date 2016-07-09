import * as React from 'react';
var ReactDOM = require("react-dom");
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');

var ServerResponse = require("../core/serverresponse");

import Volunteer from '../core/databaseobjects/volunteer';
import Group from '../core/databaseobjects/group';
import GroupEditor from '../core/editor/groupeditor';
import AddNewGroup from '../ui/group/addnewgroup';
import LoginStore from '../stores/loginstore';

var d3 = require("d3");

describe("AddNewGroup", function () {
  it("AddNewGroupLoadsInputFields", function () {
    var user = new Volunteer("john", "doe");
    user.id = '123';
    LoginStore['user'] = user;
    var AddNewGroupElement = ReactTestUtils.renderIntoDocument(
      <AddNewGroup/>
    );

    // State input uses auto suggest so it won't follow the standard rules.
    var searchFor = ['name', 'shelter', 'address', 'city', 'zipCode'];
    var found = [];
    for (let i = 0; i < searchFor.length; i++) {
      found.push(false);
    }
    var inputElements = ReactTestUtils.scryRenderedDOMComponentsWithTag(AddNewGroupElement, 'input');
    for (let j = 0; j < inputElements.length; j++) {
      for (let i = 0; i < searchFor.length; i++) {
        if (inputElements[j].id == searchFor[i]) {
          found[i] = true;
          console.log('found ' + searchFor[i]);
        }
      }
    }

    for (let i = 0; i < searchFor.length; i++) {
      if (!found[i]) {
        expect(false).toEqual(true);
      }
    }
  });

  it("AddNewGroupWarnsOnNoInput", function() {
    var user = new Volunteer("john", "doe");
    user.id = '123';
    LoginStore['user'] = user;
    var AddNewGroupElement = ReactTestUtils.renderIntoDocument(
      <AddNewGroup/>
    );
    var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
      AddNewGroupElement, "add-or-edit-btn");
    ReactTestUtils.Simulate.click(addButton);

    var errorIcons = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      AddNewGroupElement, "glyphicon-remove");
    expect(errorIcons.length > 0).toEqual(true);
  });

});


//
//   it("AddNewGroupSuccess", function () {
//     console.log("AddNewGroupSuccess");
//     var user = new Volunteer("john", "doe", "123");
//     LoginStore.user = user;
//     var AddNewGroup = ReactTestUtils.renderIntoDocument(
//       <AddNewGroup />
//     );
//     var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
//       AddNewGroup, "addNewGroupButton");
//
//     var groupNameInput = ReactDOM.findDOMNode(AddNewGroup.refs.name);
//     groupNameInput.value = "My Group";
//     ReactTestUtils.Simulate.change(groupNameInput);
//
//     var shelterNameInput = ReactDOM.findDOMNode(AddNewGroup.refs.shelter);
//     shelterNameInput.value = "My Shelter";
//     ReactTestUtils.Simulate.change(shelterNameInput);
//
//     var addressInput = ReactDOM.findDOMNode(AddNewGroup.refs.address);
//     addressInput.value = "123 Doggie Lane";
//     ReactTestUtils.Simulate.change(addressInput);
//
//     var cityInput = ReactDOM.findDOMNode(AddNewGroup.refs.city);
//     cityInput.value = "Cat City";
//     ReactTestUtils.Simulate.change(cityInput);
//
//     var stateInput = ReactDOM.findDOMNode(AddNewGroup.refs.state);
//     stateInput.value = "NY";
//     ReactTestUtils.Simulate.change(stateInput);
//
//     var zipInput = ReactDOM.findDOMNode(AddNewGroup.refs.zipCode);
//     zipInput.value = "12345";
//     ReactTestUtils.Simulate.change(zipInput);
//
//     // Mock out actual server call.
//     Group.prototype.insert = function (user, callback) {
//       var group = Group.getFakeGroups()["123"];
//       callback(group, new ServerResponse());
//     };
//     // Otherwise we'll get issues when trying to switch pages.
//     AddNewGroup.context.router = [];
//
//     ReactTestUtils.Simulate.click(addButton);
//
//     var errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
//       AddNewGroup, "has-error");
//     expect(errors.length).toEqual(0);
//   });
//
//   it("EditGroupSuccess", function () {
//     console.log("EditGroupSuccess");
//     var user = new Volunteer("john", "doe", "123");
//     LoginStore.user = user;
//     var group = new Group("My Group", "My Shelter", "123 Dog Lane", "Cat City", "NY", "12345", "5");
//     group.userPermissionsMap[123] = Group.PermissionsEnum.ADMIN;
//     var AddNewGroup = ReactTestUtils.renderIntoDocument(
//       <AddNewGroup group={group} mode="edit" />
//     );
//
//     var groupNameInput = ReactDOM.findDOMNode(AddNewGroup.refs.name);
//     expect(groupNameInput.value).toEqual("My Group");
//
//     var shelterNameInput = ReactDOM.findDOMNode(AddNewGroup.refs.shelter);
//     expect(shelterNameInput.value).toEqual("My Shelter");
//
//     var addressInput = ReactDOM.findDOMNode(AddNewGroup.refs.address);
//     expect(addressInput.value).toEqual("123 Dog Lane");
//
//     var cityInput = ReactDOM.findDOMNode(AddNewGroup.refs.city);
//     expect(cityInput.value).toEqual("Cat City");
//
//     var stateInput = ReactDOM.findDOMNode(AddNewGroup.refs.state);
//     expect(stateInput.value).toEqual("NY");
//
//     var zipInput = ReactDOM.findDOMNode(AddNewGroup.refs.zipCode);
//     expect(zipInput.value).toEqual("12345");
//   });
// });
