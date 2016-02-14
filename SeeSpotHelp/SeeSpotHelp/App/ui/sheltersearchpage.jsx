"use strict";

var React = require("react");
var ShelterSearchBox = require("./sheltersearchbox");
var LoginStore = require("../stores/loginstore");

var ShelterSearchPage = React.createClass({
    getInitialState: function () {
        return {
            user: LoginStore.user
        }
    },
    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        this.setState(
            {
                user: LoginStore.user
            });
    },
    render: function() {
        console.log("ShelterSearchPage:render");
        var user = this.state.user;
        return (
            <ShelterSearchBox user={user}/>
        );
    }
});

module.exports = ShelterSearchPage;
