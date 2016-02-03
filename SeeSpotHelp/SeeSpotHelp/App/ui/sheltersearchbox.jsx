"use strict";

var React = require("react");
var LinkContainer = require("react-router-bootstrap").LinkContainer;
var ShelterSearch = require("../scripts/sheltersearch");
var ShelterSearchResults = require("./sheltersearchresults");

var AddNewShelterButton = React.createClass({
    render: function() {
        console.log("AddNewShelterButton:render: User = " + this.props.user);
        var disabled = !this.props.user;
        var disabledDiv = "";
        if (disabled) {
            disabledDiv = (<div>*You must be logged in to add a new group</div>);
        }
        if (this.props.searchText) {
            return (
                <div>
                    <LinkContainer to={{ pathname: "addNewShelter", state: { user: this.props.user } }} disabled={disabled}>
                        <button className="btn btn-warning shelterResult">Add New Group</button>
                    </LinkContainer>
                    {disabledDiv}
                </div>
            );
        } else return (<div/>);
    }
});

var ShelterSearchBox = React.createClass({
    shelterSearch: function () {
        var searchText = document.getElementById("shelterSearchText").value;
        var results = ShelterSearch.getShelterSearchResults(searchText);
        this.setState({
            results: results,
            searchText: searchText
        });
    },
    getInitialState:function() {
        return {
            results: []
        }
    },

    render: function() {
        return (
            <div>
                <div className="input-group">
                    <input type="text" className="form-control"
                            id="shelterSearchText"
                            placeholder="Search for a shelter or volunteer group..."/>
                    <span className="input-group-btn">
                        <button type="button" className="btn btn-primary"
                           onClick={this.shelterSearch}>
                           <span className="glyphicon glyphicon-search"></span>
                        </button>
                    </span>
                </div>
                <ShelterSearchResults results={this.state.results} user={this.props.user}/>
                <AddNewShelterButton user={this.props.user} searchText={this.state.searchText}/>
            </div>
        );
    }
});

module.exports = ShelterSearchBox;