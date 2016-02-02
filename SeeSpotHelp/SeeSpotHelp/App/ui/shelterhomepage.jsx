'use strict'

var React = require('react');
var AnimalList = require('./animallist');
var ShelterSearchBox = require('./sheltersearchbox');
var ShelterInfoBox = require('./shelterinfobox');
var ShelterActionsBox = require('./shelteractionsbox');
var FakeData = require('../scripts/fakedata');
var FacebookUser = require('../scripts/facebookuser');
var Volunteer = require('../scripts/volunteer');

var ShelterHomePage = React.createClass({
    loadPageForVolunteer: function(facebookUser) {
        console.log("loadPageForVolunteer");
        if (!facebookUser) {
            console.log("initiating new facebook user");
            facebookUser = new FacebookUser();
        }

        // TODO: Check multi-threaded access to this variable. And clean this up.
        // It's messy, there has to be a better way using callbacks instead of
        // a wait loop.   Probably should pass in to facebookUser a callback
        // function so we can load the right page once the user is logged in.
        // Make sure to avoid a flicker of "not logged in page" to "logged in page".
        if (facebookUser.loading) {
            console.log("Facebook user still loading, try again");
            setTimeout(this.loadPageForVolunteer.bind(this, facebookUser), 10);
            return;
        }

        this.setState({volunteer: facebookUser.volunteer});
        sessionStorage.setItem("volunteer", JSON.stringify(facebookUser.volunteer));

        // If there isn't yet a default group choosen for this session, seed it from
        // server side data, whatever group the volunteer is a part of.  Searching and
        // selecting another group will overrie the session default, so the user
        // continues to see their last selected group, but it will not be stored on the
        // server unless the volunteer is an actual group member.  Will have to work
        // this use case out more.
        if (!this.state.defaultGroup) {
            this.setState({ "defaultGroup": facebookUser.volunteer.GetDefaultVolunteerGroup() });
        }
    },

    getInitialState: function() {
        console.log("ShelterHomePage::getInitialState");
        var defaultGroup = null;
        if (sessionStorage.getItem("defaultGroup")) {
            console.log("defaultGroup stored as " + sessionStorage.getItem("defaultGroup"));
            defaultGroup = JSON.parse(sessionStorage.getItem("defaultGroup"));
        }

        // TODO: We are waiting 1 second because FB SDK is loaded async, you may get a
        // "FB is undefined" error. Will work on it.
        setTimeout(this.loadPageForVolunteer, 1000);

        return {
            defaultGroup: defaultGroup,
            volunteer: null
        }
    },

    render: function () {
        console.log("shelterhomepage::render");
        var query = this.props.location.query;
        var defaultGroup = this.state.defaultGroup;
        
        console.log("state default group? " + defaultGroup);
        if (query && query.groupId) {
            defaultGroup = FakeData.fakeVolunteerGroupData[query.groupId];
            sessionStorage.setItem("defaultGroup", JSON.stringify(defaultGroup));
        }
        if (defaultGroup) {
            var animals = FakeData.getFakeAnimalDataForGroup(defaultGroup.id);
            return (
                <div>
                    <ShelterInfoBox group={defaultGroup}/>
                    <ShelterActionsBox />
                    <hr/>
                    <AnimalList animals={animals}/>
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <div>
                    <ShelterSearchBox/>
                </div>
            );
        }
    }
});

module.exports = ShelterHomePage;
