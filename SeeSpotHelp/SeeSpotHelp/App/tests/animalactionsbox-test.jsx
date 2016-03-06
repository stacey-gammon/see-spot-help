var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
	Volunteer = require("../core/volunteer"),
	VolunteerGroup = require("../core/volunteergroup"),
	LoginStore = require("../stores/loginstore"),
	FakeData = require("../core/fakedata"),
	AnimalActionsBox = require("../ui/animal/animalactionsbox.jsx");

var d3 = require("d3");

describe("AnimalActionsBox", function () {
	it("ButtonsEnabledForMember", function () {
		var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
		var group = VolunteerGroup.getFakeGroups()["123"];
		console.log("group = ");
		console.log(group);
		volunteer.groups = [group];
		LoginStore.user = volunteer;

		volunteer.groups[0].userPermissionsMap["115"] =
			VolunteerGroup.PermissionsEnum.MEMBER;
		var animal = FakeData.getFakeAnimalData()["123"][0];

		var animalActionsBox = ReactTestUtils.renderIntoDocument(
			<AnimalActionsBox group={group} animal={animal}/>
		);

		var addNoteButton = ReactTestUtils.findRenderedDOMComponentWithClass(
			animalActionsBox, "addAnimalNoteButton");
		expect(addNoteButton.disabled).toEqual(false);
	});

	it("ButtonsDisabledForNonMember", function () {
		var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
		var group = VolunteerGroup.getFakeGroups()["123"];
		var animal = FakeData.getFakeAnimalData()["123"][0];
		LoginStore.user = volunteer;

		var animalActionsBox = ReactTestUtils.renderIntoDocument(
			<AnimalActionsBox group={group} animal={animal} />
		);

		var addNoteButton = ReactTestUtils.findRenderedDOMComponentWithClass(
			animalActionsBox, "addAnimalNoteButton");
		expect(addNoteButton.disabled).toEqual(true);
	});

	it("ButtonsDisabledForNoUser", function () {
		var group = VolunteerGroup.getFakeGroups()["123"];
		var animal = FakeData.getFakeAnimalData()["123"][0];
		LoginStore.user = null;

		var animalActionsBox = ReactTestUtils.renderIntoDocument(
			<AnimalActionsBox group={group} animal={animal} />
		);

		var addNoteButton = ReactTestUtils.findRenderedDOMComponentWithClass(
			animalActionsBox, "addAnimalNoteButton");
		expect(addNoteButton.disabled).toEqual(true);
	});
});
