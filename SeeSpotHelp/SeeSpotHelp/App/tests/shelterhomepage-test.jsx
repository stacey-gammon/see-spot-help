var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
    Volunteer = require("../core/volunteer"),
    VolunteerGroup = require("../core/volunteergroup"),
    LoginStore = require("../stores/loginstore"),
    ShelterHomePage = require("../ui/shelterhomepage.jsx");

var d3 = require("d3");

describe("ShelterHomePage", function () {
    it("ShowSearchBarNoUser", function () {
        LoginStore.user = null;
        var shelterHomePage = ReactTestUtils.renderIntoDocument(
            <ShelterHomePage />
        );
        ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterHomePage, "shelterSearchBox");
    });

    it("ShowSearchBarNullUser", function () {
        LoginStore.user = null;
        var shelterHomePage = ReactTestUtils.renderIntoDocument(
            <ShelterHomePage/>
        );
        ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterHomePage, "shelterSearchBox");
    });

    it("ShowDefaultGroupLoggedIn", function () {
        var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
        volunteer.groups = [VolunteerGroup.getFakeGroups()["123"]];
        LoginStore.user = volunteer;
        var shelterHomePage = ReactTestUtils.renderIntoDocument(
            <ShelterHomePage/>
        );

        var inputFields = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            shelterHomePage, "input");
        expect(inputFields.length).toEqual(0);

        ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterHomePage, "shelterInfoBox");
    });
});


