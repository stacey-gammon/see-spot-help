var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var expect = require("expect"),
    Volunteer = require("../scripts/volunteer"),
    VolunteerGroup = require("../scripts/volunteergroup"),
    ShelterActionsBox = require("../ui/shelteractionsbox.jsx");

var d3 = require("d3");

var TestDiv = React.createClass({
    render: function () {
        console.log("TestDiv::render");
        return (
            <div>
                <h1>Hi, I'm test A!</h1>
            </div>
        );
    }
});

describe("ShelterActionsBox", function () {
    it("Contains leave button for members", function () {
        var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
        var group = new VolunteerGroup("Group name", "shelter name", "address", "25");
        group.userPermissionsMap["115"] = VolunteerGroup.PermissionsEnum.MEMBER;

        var shelterActionsBox = ReactTestUtils.renderIntoDocument(
            <ShelterActionsBox user={volunteer} group={group}/>
        );

        var buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            shelterActionsBox, "button");

        var foundLeaveButton = false;
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].id == "leaveShelterButton")
                foundLeaveButton = true;
        }
        expect(foundLeaveButton).toEqual(true);
    });

    it("No leave button for nonmembers", function () {
        var volunteer = new Volunteer("Sally", "sally@sally.com", "115");
        var group = new VolunteerGroup("Group name", "shelter name", "address", "25");

        var shelterActionsBox = ReactTestUtils.renderIntoDocument(
            <ShelterActionsBox user={volunteer} group={group}/>
        );

        var buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            shelterActionsBox, "button");

        var foundLeaveButton = false;
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].id == "leaveShelterButton")
                foundLeaveButton = true;
        }
        expect(foundLeaveButton).toEqual(false);
        });
});
