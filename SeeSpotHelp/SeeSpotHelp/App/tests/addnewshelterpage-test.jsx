var React = require("react");
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
});
