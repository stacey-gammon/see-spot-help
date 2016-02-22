"use strict"

var React = require("react");
var Volunteer = require("../core/volunteer");
var FacebookLogin = require("./facebooklogin");
var LoginStore = require("../stores/loginstore");
var AJAXServices = require("../core/AJAXServices");

var LoginPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    render: function () {
        console.log("LoginPage::render");
        return (<div>
                    <h1>To get started, log in with your facebook account.</h1>
                    <FacebookLogin/>
                </div>
        );
    }
});

module.exports = LoginPage;
