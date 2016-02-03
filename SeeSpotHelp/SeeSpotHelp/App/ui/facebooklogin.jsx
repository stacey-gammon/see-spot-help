'use strict'

var React = require('react');

var FacebookLogin = React.createClass({
    handleLoggedIn: function() {
        console.log("handling logging in");
    },
    render: function () {
        return (
            <div className="fb-login-button" onLogin={this.handleLoggedIn} data-max-rows="1" data-size="large" data-show-faces="false" data-auto-logout-link="true"/>
        );
    }
});

module.exports = FacebookLogin;
