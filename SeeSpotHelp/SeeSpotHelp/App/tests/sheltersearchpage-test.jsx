var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
    Volunteer = require("../core/volunteer"),
    VolunteerGroup = require("../core/volunteergroup"),
    LoginStore = require("../stores/loginstore"),
    SearchPage = require("../ui/searchpage.jsx");

var d3 = require("d3");

describe("SearchPage", function () {
    it("ShowEnabledAddButtonAfterSearchForLoggedInUser", function () {
        var user = new Volunteer("sally", "sallyemail", "123");
        LoginStore.user = user;
        var shelterSearchPage = ReactTestUtils.renderIntoDocument(
            <SearchPage user={user}/>
        );

        // No add button until the user actually starts a search.
        var addButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            shelterSearchPage, "AddNewGroupButton");
        expect(addButtons.length).toEqual(0);

        var searchInput = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "shelterSearchInput");
        searchInput.value = "anything";

        var searchButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "shelterSearchButton");
        ReactTestUtils.Simulate.click(searchButton);

        var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "AddNewGroupButton");
        expect(addButton.disabled).toEqual(false);
    });

    it("ShowDisabledAddButtonAfterSearchForNoUser", function () {
        LoginStore.user = null;
        var shelterSearchPage = ReactTestUtils.renderIntoDocument(
            <SearchPage />
        );
        // No add button until the user actually starts a search.
        var addButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            shelterSearchPage, "AddNewGroupButton");
        expect(addButtons.length).toEqual(0);

        var searchInput = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "shelterSearchInput");
        searchInput.value = "anything";

        var searchButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "shelterSearchButton");
        ReactTestUtils.Simulate.click(searchButton);

        var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterSearchPage, "AddNewGroupButton");
        expect(addButton.disabled).toEqual(true);
    });
});
