"use strict";

var React = require("react");
var SearchBox = require("./searchbox");
var LoginStore = require("../stores/loginstore");

var SearchPage = React.createClass({
    getInitialState: function () {
        return {
            user: LoginStore.getUser()
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
                user: LoginStore.getUser()
            });
    },
    render: function() {
        console.log("SearchPage:render");
        var user = this.state.user;
        return (
            <SearchBox user={user}/>
        );
    }
});

module.exports = SearchPage;
