var React = require("react");
var ReactDOM = require("react-dom");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
    Volunteer = require("../scripts/volunteer"),
    VolunteerGroup = require("../scripts/volunteergroup"),
    AddNewShelter = require("../ui/addnewshelter.jsx");

var d3 = require("d3");

describe("AddNewShelter", function () {
    it("AddNewShelterLoadsInputFields", function () {
        var user = new Volunteer("john", "doe", "123");
        var addNewShelter = ReactTestUtils.renderIntoDocument(
            <AddNewShelter user={user}/>
        );
        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "groupName");
        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "shelterName");
        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "address");
        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "city");
        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "state");
        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "zipCode");
    });

    it("AddNewShelterWarnsOnNoInput", function() {
        var user = new Volunteer("john", "doe", "123");
        var addNewShelter = ReactTestUtils.renderIntoDocument(
            <AddNewShelter user={user}/>
        );
        var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "addNewGroupButton");
        ReactTestUtils.Simulate.click(addButton);

        var errorIcons = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            addNewShelter, "glyphicon-remove");
        expect(errorIcons.length > 0).toEqual(true);
    });

    it("AddNewShelterWarnGoesAwayAfterInput", function () {
        var user = new Volunteer("john", "doe", "123");
        var addNewShelter = ReactTestUtils.renderIntoDocument(
            <AddNewShelter user={user} />
        );
        var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "addNewGroupButton");
        ReactTestUtils.Simulate.click(addButton);

        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "groupNameErrorValidationSpan");

        var groupNameInput = ReactDOM.findDOMNode(addNewShelter.refs.groupName);
        groupNameInput.value = "value";
        ReactTestUtils.Simulate.change(groupNameInput);
        ReactTestUtils.Simulate.click(addButton);

        var errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            addNewShelter, "groupNameErrorValidationSpan");
        expect(errors.length).toEqual(0);

        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "groupNameSuccessValidationSpan");
    });

    it("AddNewShelterSuccess", function () {
        console.log("AddNewShelterSuccess");
        var user = new Volunteer("john", "doe", "123");
        var addNewShelter = ReactTestUtils.renderIntoDocument(
            <AddNewShelter user={user} />
        );
        var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "addNewGroupButton");

        var groupNameInput = ReactDOM.findDOMNode(addNewShelter.refs.groupName);
        groupNameInput.value = "My Group";
        ReactTestUtils.Simulate.change(groupNameInput);

        var shelterNameInput = ReactDOM.findDOMNode(addNewShelter.refs.shelterName);
        shelterNameInput.value = "My Shelter";
        ReactTestUtils.Simulate.change(shelterNameInput);

        var addressInput = ReactDOM.findDOMNode(addNewShelter.refs.address);
        addressInput.value = "123 Doggie Lane";
        ReactTestUtils.Simulate.change(addressInput);

        var cityInput = ReactDOM.findDOMNode(addNewShelter.refs.city);
        cityInput.value = "Cat City";
        ReactTestUtils.Simulate.change(cityInput);

        var stateInput = ReactDOM.findDOMNode(addNewShelter.refs.state);
        stateInput.value = "NY";
        ReactTestUtils.Simulate.change(stateInput);

        var zipInput = ReactDOM.findDOMNode(addNewShelter.refs.zipCode);
        zipInput.value = "12345";
        ReactTestUtils.Simulate.change(zipInput);

        ReactTestUtils.Simulate.click(addButton);

        var errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            addNewShelter, "has-error");
        expect(errors.length).toEqual(0);

        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "groupNameSuccessValidationSpan");
    });
});
