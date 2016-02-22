"use strict"

var React = require("react");
var Link = require("react-router").Link;
var FakeData = require("../core/fakedata");
var Volunteer = require("../core/volunteer");
var VolunteerGroup = require("../core/volunteergroup");
var FacebookLogin = require("./facebooklogin");
var ShelterInfoBox = require("./shelterinfobox");
var AddNewShelter = require("./addnewshelter");
var ShelterSearchPage = require("./sheltersearchpage");
var LoginStore = require("../stores/loginstore");
var AJAXServices = require("../core/AJAXServices");


var PrivateBetaPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    signUp: function() {
        var email = { email: this.refs[email].value };
        AJAXServices.PushFirebaseData("betaWaitingList", email);
    },

    render: function () {
        console.log("PrivateBetaPage::render");
        return (<div>
                    <h1>I'm sorry, this application is currently in private beta.
    Enter your email address to be put on the waiting list.</h1>
                    <input type="text"
                           ref="email"
                           defaultValue="email address"/>
                <button className="btn btn-primary"
                        onClick={this.signUp}>Enter</button>
                </div>
        );
    }
});

module.exports = PrivateBetaPage;
