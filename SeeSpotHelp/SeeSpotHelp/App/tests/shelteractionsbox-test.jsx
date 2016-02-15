var React = require("react");
var ReactDOM = require("react-dom");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
    Volunteer = require("../core/volunteer"),
    VolunteerGroup = require("../core/volunteergroup"),
    ConstStrings = require("../core/conststrings"),
    LoginStore = require("../stores/loginstore"),
    ShelterActionsBox = require("../ui/shelteractionsbox.jsx");

var d3 = require("d3");

describe("ShelterActionsBox", function () {
    it("LeaveButtonForMember", function () {
        var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
        LoginStore.user = volunteer;
        var group = new VolunteerGroup("Group name", "shelter name", "address", "25");
        group.userPermissionsMap["115"] = VolunteerGroup.PermissionsEnum.MEMBER;

        var shelterActionsBox = ReactTestUtils.renderIntoDocument(
            <ShelterActionsBox group={group}/>
        );

        ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterActionsBox, "leaveShelterButton");
    });

    it("NoLeaveButtonForNonMember", function () {
        var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
        LoginStore.user = volunteer;
        var group = new VolunteerGroup("Group name", "shelter name", "address", "25");

        var shelterActionsBox = ReactTestUtils.renderIntoDocument(
            <ShelterActionsBox group={group}/>
        );

        var leaveButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            shelterActionsBox, "leaveShelterButton");
        expect(leaveButtons.length).toEqual(0);
    });

    it("RequestJoinButtonForNonMember", function () {
        var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
        LoginStore.user = volunteer;
        var group = new VolunteerGroup("Group name", "shelter name", "address", "25");

        var shelterActionsBox = ReactTestUtils.renderIntoDocument(
            <ShelterActionsBox group={group}/>
        );

        ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterActionsBox, "requestToJoinButton");
    });
    
    it("NoRequestJoinButtonForNotLoggedIn", function () {
        var group = new VolunteerGroup("Group name", "shelter name", "address", "25");
        LoginStore.user = null;
        var shelterActionsBox = ReactTestUtils.renderIntoDocument(
            <ShelterActionsBox group={group}/>
        );

        var leaveButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            shelterActionsBox, "requestToJoinButton");
        expect(leaveButtons.length).toEqual(0);
    });

    it("NoRequestJoinButtonForMember", function () {
        var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
        LoginStore.user = volunteer;
        var group = new VolunteerGroup("Group name", "shelter name", "address", "25");
        group.userPermissionsMap["115"] = VolunteerGroup.PermissionsEnum.MEMBER;

        var shelterActionsBox = ReactTestUtils.renderIntoDocument(
            <ShelterActionsBox group={group}/>
        );

        var leaveButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            shelterActionsBox, "requestToJoinButton");
        expect(leaveButtons.length).toEqual(0);
    });

    it("RequestPendingButtonForPendingMember", function () {
        var user = new Volunteer("Sally", "sally@sally.com", "115");
        LoginStore.user = user;
        var group = new VolunteerGroup("Group name", "shelter name", "address", "25");
        group.userPermissionsMap["115"] = VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP;

        var shelterActionsBox = ReactTestUtils.renderIntoDocument(
            <ShelterActionsBox group={group}/>
        );

        var requestToJoinButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            shelterActionsBox, "requestToJoinButton");
        expect(requestToJoinButton.innerHTML).toEqual(ConstStrings.JoinRequestPending);
        expect(requestToJoinButton.disabled).toEqual(true);
    });

    it("CheckButtonsForAdmin", function () {
        var user = new Volunteer("Sally", "sally@sally.com", "115");
        LoginStore.user = user;
        var group = new VolunteerGroup("Group name", "shelter name", "address", "25");
        group.userPermissionsMap["115"] = VolunteerGroup.PermissionsEnum.ADMIN;

        var shelterActionsBox = ReactTestUtils.renderIntoDocument(
            <ShelterActionsBox group={group}/>
        );

        var requestToJoinButton = ReactDOM.findDOMNode(
            shelterActionsBox.refs.requestToJoinButton);
        expect(requestToJoinButton).toEqual(null);
        var editButton = ReactDOM.findDOMNode(
            shelterActionsBox.refs.editShelterButton);
        expect(editButton.disabled).toEqual(false);
    });
});
