"use strict"

var React = require("react");
var Link = require("react-router").Link;
var AnimalList = require("../animal/animallist");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("./groupinfobox");
var GroupActionsBox = require("./groupactionsbox");
var FakeData = require("../../core/fakedata");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var AJAXServices = require("../../core/AJAXServices");
var AddAdoptableButton = require("../animal/addanimalbutton");

var GroupAnimalsTab = React.createClass({
    getInitialState: function () {
        var group = this.props.location &&
                    this.props.location.state &&
                    this.props.location.state.group ||
                    this.props.group;
        return {
            user: LoginStore.getUser(),
            group: group
        }
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            group: nextProps.group
        });
    },

    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
        GroupStore.addChangeListener(this.onChange);
    },

    componentWillMount: function () {
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
        GroupStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        this.setState(
            {
                user: LoginStore.user,
                group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
            });
    },

    render: function () {
        console.log("GroupAnimalsTab, group:");
        console.log(this.state.group);
        return (
            <div className="shelterAnimalsTab">
                <AddAdoptableButton group={this.state.group} user={this.state.user}/>
                <AnimalList group={this.state.group} user={this.state.user}/>
            </div>
        );
    }
});

module.exports = GroupAnimalsTab;
