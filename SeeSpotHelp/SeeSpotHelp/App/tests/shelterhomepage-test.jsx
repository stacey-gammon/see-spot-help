var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
	Volunteer = require("../core/volunteer"),
	VolunteerGroup = require("../core/volunteergroup"),
	LoginStore = require("../stores/loginstore"),
	GroupHomePage = require("../ui/GroupHomePage.jsx");

var d3 = require("d3");

describe("GroupHomePage", function () {
	it("ShowSearchBarNoUser", function () {
		LoginStore.user = null;
		var GroupHomePage = ReactTestUtils.renderIntoDocument(
			<GroupHomePage />
		);
		ReactTestUtils.findRenderedDOMComponentWithClass(
			GroupHomePage, "SearchBox");
	});

	it("ShowSearchBarNullUser", function () {
		LoginStore.user = null;
		var GroupHomePage = ReactTestUtils.renderIntoDocument(
			<GroupHomePage/>
		);
		ReactTestUtils.findRenderedDOMComponentWithClass(
			GroupHomePage, "SearchBox");
	});

	it("ShowDefaultGroupLoggedIn", function () {
		var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
		volunteer.groups = [VolunteerGroup.getFakeGroups()["123"]];
		LoginStore.user = volunteer;
		var GroupHomePage = ReactTestUtils.renderIntoDocument(
			<GroupHomePage/>
		);

		var inputFields = ReactTestUtils.scryRenderedDOMComponentsWithTag(
			GroupHomePage, "input");
		expect(inputFields.length).toEqual(0);

		ReactTestUtils.findRenderedDOMComponentWithClass(
			GroupHomePage, "shelterInfoBox");
	});
});


