"use strict";

var React = require("react");
var ShelterSearchBox = require("./sheltersearchbox");

var ShelterSearchPage = React.createClass({
    render: function() {
        console.log("ShelterSearchPage:render");
        var user = this.props.user;
        if (!user && this.props.location.state && this.props.location.state.user) {
            console.log("User set in state, loading..");
            user = this.props.location.state.user;
        }
        return (
            <div>
            <ShelterSearchBox user={user}/>
            {this.props.children}
            </div>
        );
    }
});

module.exports = ShelterSearchPage;
