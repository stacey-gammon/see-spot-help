var React = require("react");
var ReactDOM = require("react-dom");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
	Volunteer = require("../core/volunteer"),
	VolunteerGroup = require("../core/volunteergroup"),
	ServerResponse = require("../core/serverresponse"),
	AddNewGroup = require("../ui/group/addnewgroup");
var LoginStore = require("../stores/loginstore");

var d3 = require("d3");

describe("AddNewGroup", function () {
	it("AddNewGroupLoadsInputFields", function () {
		var user = new Volunteer("john", "doe", "123");
		LoginStore.user = user;
		var AddNewGroup = ReactTestUtils.renderIntoDocument(
			<AddNewGroup/>
		);
		ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "name");
		ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "shelter");
		ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "address");
		ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "city");
		ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "state");
		ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "zipCode");
	});

	it("AddNewGroupWarnsOnNoInput", function() {
		var user = new Volunteer("john", "doe", "123");
		LoginStore.user = user;
		var AddNewGroup = ReactTestUtils.renderIntoDocument(
			<AddNewGroup/>
		);
		var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "addNewGroupButton");
		ReactTestUtils.Simulate.click(addButton);

		var errorIcons = ReactTestUtils.scryRenderedDOMComponentsWithClass(
			AddNewGroup, "glyphicon-remove");
		expect(errorIcons.length > 0).toEqual(true);
	});

	it("AddNewGroupWarnGoesAwayAfterInput", function () {
		var user = new Volunteer("john", "doe", "123");
		LoginStore.user = user;
		var AddNewGroup = ReactTestUtils.renderIntoDocument(
			<AddNewGroup />
		);
		var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "addNewGroupButton");
		ReactTestUtils.Simulate.click(addButton);

		ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "nameErrorValidationSpan");

		var groupNameInput = ReactDOM.findDOMNode(AddNewGroup.refs.name);
		groupNameInput.value = "value";
		ReactTestUtils.Simulate.change(groupNameInput);
		ReactTestUtils.Simulate.click(addButton);

		var errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
			AddNewGroup, "nameErrorValidationSpan");
		expect(errors.length).toEqual(0);

		ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "nameSuccessValidationSpan");
	});

	it("AddNewGroupSuccess", function () {
		console.log("AddNewGroupSuccess");
		var user = new Volunteer("john", "doe", "123");
		LoginStore.user = user;
		var AddNewGroup = ReactTestUtils.renderIntoDocument(
			<AddNewGroup />
		);
		var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(
			AddNewGroup, "addNewGroupButton");

		var groupNameInput = ReactDOM.findDOMNode(AddNewGroup.refs.name);
		groupNameInput.value = "My Group";
		ReactTestUtils.Simulate.change(groupNameInput);

		var shelterNameInput = ReactDOM.findDOMNode(AddNewGroup.refs.shelter);
		shelterNameInput.value = "My Shelter";
		ReactTestUtils.Simulate.change(shelterNameInput);

		var addressInput = ReactDOM.findDOMNode(AddNewGroup.refs.address);
		addressInput.value = "123 Doggie Lane";
		ReactTestUtils.Simulate.change(addressInput);

		var cityInput = ReactDOM.findDOMNode(AddNewGroup.refs.city);
		cityInput.value = "Cat City";
		ReactTestUtils.Simulate.change(cityInput);

		var stateInput = ReactDOM.findDOMNode(AddNewGroup.refs.state);
		stateInput.value = "NY";
		ReactTestUtils.Simulate.change(stateInput);

		var zipInput = ReactDOM.findDOMNode(AddNewGroup.refs.zipCode);
		zipInput.value = "12345";
		ReactTestUtils.Simulate.change(zipInput);

		// Mock out actual server call.
		VolunteerGroup.prototype.insert = function (user, callback) {
			var group = VolunteerGroup.getFakeGroups()["123"];
			callback(group, new ServerResponse());
		};
		// Otherwise we'll get issues when trying to switch pages.
		AddNewGroup.context.router = [];

		ReactTestUtils.Simulate.click(addButton);

		var errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(
			AddNewGroup, "has-error");
		expect(errors.length).toEqual(0);
	});

	it("EditGroupSuccess", function () {
		console.log("EditGroupSuccess");
		var user = new Volunteer("john", "doe", "123");
		LoginStore.user = user;
		var group = new VolunteerGroup("My Group", "My Shelter", "123 Dog Lane", "Cat City", "NY", "12345", "5");
		group.userPermissionsMap[123] = VolunteerGroup.PermissionsEnum.ADMIN;
		var AddNewGroup = ReactTestUtils.renderIntoDocument(
			<AddNewGroup group={group} mode="edit" />
		);

		var groupNameInput = ReactDOM.findDOMNode(AddNewGroup.refs.name);
		expect(groupNameInput.value).toEqual("My Group");

		var shelterNameInput = ReactDOM.findDOMNode(AddNewGroup.refs.shelter);
		expect(shelterNameInput.value).toEqual("My Shelter");

		var addressInput = ReactDOM.findDOMNode(AddNewGroup.refs.address);
		expect(addressInput.value).toEqual("123 Dog Lane");

		var cityInput = ReactDOM.findDOMNode(AddNewGroup.refs.city);
		expect(cityInput.value).toEqual("Cat City");

		var stateInput = ReactDOM.findDOMNode(AddNewGroup.refs.state);
		expect(stateInput.value).toEqual("NY");

		var zipInput = ReactDOM.findDOMNode(AddNewGroup.refs.zipCode);
		expect(zipInput.value).toEqual("12345");
	});
});
