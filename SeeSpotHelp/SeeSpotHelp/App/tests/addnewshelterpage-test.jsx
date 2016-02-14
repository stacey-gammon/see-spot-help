var React = require("react");
var ReactDOM = require("react-dom");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
    Volunteer = require("../scripts/volunteer"),
    VolunteerGroup = require("../scripts/volunteergroup"),
    AddNewShelter = require("../ui/addnewshelter.jsx");
var LoginStore = require("../stores/loginstore");

var d3 = require("d3");

describe("AddNewShelter", function () {
    it("AddNewShelterLoadsInputFields", function () {
        var user = new Volunteer("john", "doe", "123");
        LoginStore.user = user;
        var addNewShelter = ReactTestUtils.renderIntoDocument(
            <AddNewShelter/>
        );
        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "name");
        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "shelter");
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
        LoginStore.user = user;
        var addNewShelter = ReactTestUtils.renderIntoDocument(
            <AddNewShelter/>
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
        LoginStore.user = user;
        var addNewShelter = ReactTestUtils.renderIntoDocument(
            <AddNewShelter />
        );
        var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "addNewGroupButton");
        ReactTestUtils.Simulate.click(addButton);

        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "nameErrorValidationSpan");

        var groupNameInput = ReactDOM.findDOMNode(addNewShelter.refs.name);
        groupNameInput.value = "value";
        ReactTestUtils.Simulate.change(groupNameInput);
        ReactTestUtils.Simulate.click(addButton);

        var errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            addNewShelter, "nameErrorValidationSpan");
        expect(errors.length).toEqual(0);

        ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "nameSuccessValidationSpan");
    });

    it("AddNewShelterSuccess", function () {
        console.log("AddNewShelterSuccess");
        var user = new Volunteer("john", "doe", "123");
        LoginStore.user = user;
        var addNewShelter = ReactTestUtils.renderIntoDocument(
            <AddNewShelter />
        );
        var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            addNewShelter, "addNewGroupButton");

        var groupNameInput = ReactDOM.findDOMNode(addNewShelter.refs.name);
        groupNameInput.value = "My Group";
        ReactTestUtils.Simulate.change(groupNameInput);

        var shelterNameInput = ReactDOM.findDOMNode(addNewShelter.refs.shelter);
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
            addNewShelter, "nameSuccessValidationSpan");
    });

    it("EditGroupSuccess", function () {
        console.log("EditGroupSuccess");
        var user = new Volunteer("john", "doe", "123");
        LoginStore.user = user;
        var group = new VolunteerGroup("My Group", "My Shelter", "123 Dog Lane", "Cat City", "NY", "12345", "5");
        group.userPermissionsMap[123] = VolunteerGroup.PermissionsEnum.ADMIN;
        var addNewShelter = ReactTestUtils.renderIntoDocument(
            <AddNewShelter group={group} editMode="true" />
        );

        var groupNameInput = ReactDOM.findDOMNode(addNewShelter.refs.name);
        expect(groupNameInput.value).toEqual("My Group");

        var shelterNameInput = ReactDOM.findDOMNode(addNewShelter.refs.shelter);
        expect(shelterNameInput.value).toEqual("My Shelter");

        var addressInput = ReactDOM.findDOMNode(addNewShelter.refs.address);
        expect(addressInput.value).toEqual("123 Dog Lane");

        var cityInput = ReactDOM.findDOMNode(addNewShelter.refs.city);
        expect(cityInput.value).toEqual("Cat City");

        var stateInput = ReactDOM.findDOMNode(addNewShelter.refs.state);
        expect(stateInput.value).toEqual("NY");

        var zipInput = ReactDOM.findDOMNode(addNewShelter.refs.zipCode);
        expect(zipInput.value).toEqual("12345");
    });
});
