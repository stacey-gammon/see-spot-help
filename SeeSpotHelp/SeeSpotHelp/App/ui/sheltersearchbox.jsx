"use strict";

var React = require("react");
var LinkContainer = require("react-router-bootstrap").LinkContainer;
var VolunteerGroup = require("../core/volunteergroup");
var ShelterSearchResults = require("./sheltersearchresults");
var LoginStore = require("../stores/loginstore");
var AJAXServices = require("../core/AJAXServices");
var Firebase = require("firebase");

var AddNewShelterButton = React.createClass({
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
                user: LoginStore.user
            });
    },

    render: function() {
        console.log("AddNewShelterButton:render: User = " + this.state.user);
        var disabled = !this.state.user;
        var disabledDiv = "";
        if (disabled) {
            disabledDiv = (<div>*You must be logged in to add a new group</div>);
        }
        if (this.props.searchText) {
            return (
                <div>
                    <LinkContainer to={{ pathname: "addNewShelter", state: { user: this.state.user } }} disabled={disabled}>
                        <button className="btn btn-warning shelterResult addNewShelterButton">Add New Group</button>
                    </LinkContainer>
                    {disabledDiv}
                </div>
            );
        } else return (<div/>);
    }
});

var ShelterSearchBox = React.createClass({
    getInitialState: function () {
        return {
            results: {}
        }
    },

    getResults: function (results) {
        console.log("ShelterSearchBox:getResults:");
        console.log(results);
        this.setState({
            results: results
        });
    },

    shelterSearch: function () {
        var searchText = this.refs.shelterSearchInput.value;
        AJAXServices.startStringSearch("groups", "name", searchText, this.getResults);
    },

    render: function () {
        console.log("ShelterSearchBox::render, results:");
        console.log(this.state.results);
        return (
            <div className="shelterSearchBox">
                <h1>Search for a shelter, rescue or volunteer group to join</h1>
                <div className="input-group">
                    <input type="text" className="form-control shelterSearchInput"
                           ref="shelterSearchInput"
                           placeholder="Search..."/>
                    <span className="input-group-btn">
                        <button type="button" className="btn btn-primary shelterSearchButton"
                           onClick={this.shelterSearch}>
                           <span className="glyphicon glyphicon-search"></span>
                        </button>
                    </span>
                </div>
                <ShelterSearchResults results={this.state.results} user={this.state.user}/>
                <AddNewShelterButton user={this.state.user} searchText={this.state.searchText}/>
            </div>
        );
    }
});

module.exports = ShelterSearchBox;