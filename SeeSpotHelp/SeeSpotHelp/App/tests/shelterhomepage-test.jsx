var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
    Volunteer = require("../scripts/volunteer"),
    VolunteerGroup = require("../scripts/volunteergroup"),
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
        // TODO: Currently every user has a default group because of
        // fake data, but that won't always be the case.  Depending on how
        // we modify that functionality, this will have to be updated.
        var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
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


