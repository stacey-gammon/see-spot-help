var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
    Volunteer = require("../core/volunteer"),
    VolunteerGroup = require("../core/volunteergroup"),
    LoginStore = require("../stores/loginstore"),
    ShelterSearchPage = require("../ui/sheltersearchpage.jsx");

var d3 = require("d3");

describe("ShelterSearchPage", function () {
    it("ShowEnabledAddButtonAfterSearchForLoggedInUser", function () {
        var user = new Volunteer("sally", "sallyemail", "123");
        LoginStore.user = user;
        var shelterSearchPage = ReactTestUtils.renderIntoDocument(
            <ShelterSearchPage user={user}/>
        );

        // No add button until the user actually starts a search.
        var addButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            shelterSearchPage, "addNewShelterButton");
        expect(addButtons.length).toEqual(0);

        var searchInput = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "shelterSearchInput");
        searchInput.value = "anything";

        var searchButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "shelterSearchButton");
        ReactTestUtils.Simulate.click(searchButton);

        var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "addNewShelterButton");
        expect(addButton.disabled).toEqual(false);
    });

    it("ShowDisabledAddButtonAfterSearchForNoUser", function () {
        LoginStore.user = null;
        var shelterSearchPage = ReactTestUtils.renderIntoDocument(
            <ShelterSearchPage />
        );
        // No add button until the user actually starts a search.
        var addButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            shelterSearchPage, "addNewShelterButton");
        expect(addButtons.length).toEqual(0);

        var searchInput = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "shelterSearchInput");
        searchInput.value = "anything";

        var searchButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "shelterSearchButton");
        ReactTestUtils.Simulate.click(searchButton);

        var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "addNewShelterButton");
        expect(addButton.disabled).toEqual(true);
    });
});
