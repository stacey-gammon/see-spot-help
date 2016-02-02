'use strict'

var React = require('react');

var FacebookLogin = React.createClass({
    render: function () {
        return (
            <div className="fb-login-button" data-max-rows="1" data-size="large" data-show-faces="false" data-auto-logout-link="true"/>
            );
        }
});

module.exports = FacebookLogin;
