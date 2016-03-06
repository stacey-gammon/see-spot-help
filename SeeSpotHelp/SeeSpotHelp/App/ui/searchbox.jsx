"use strict";

var React = require("react");
var Link = require("react-router").Link;
var LinkContainer = require("react-router-bootstrap").LinkContainer;
var VolunteerGroup = require("../core/volunteergroup");
var ShelterSearchResults = require("./searchresults");
var LoginStore = require("../stores/loginstore");
var AJAXServices = require("../core/AJAXServices");
var Firebase = require("firebase");

var AddNewGroupButton = React.createClass({
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
		console.log("AddNewGroupButton:render: User = " + this.state.user);
		var disabled = !this.state.user;
		var disabledDiv = "";
		if (disabled) {
			disabledDiv = (<div>*You must be logged in to add a new group</div>);
		}
		if (this.props.searchText) {
			return (
				<div>
					<LinkContainer to={{ pathname: "AddNewGroup", state: { user: this.state.user } }} disabled={disabled}>
						<button className="btn btn-warning shelterResult AddNewGroupButton">Add New Group</button>
					</LinkContainer>
					{disabledDiv}
				</div>
			);
		} else return (<div/>);
	}
});

var SearchBox = React.createClass({
	getInitialState: function () {
		return {
			results: {}
		}
	},

	getResults: function (results) {
		console.log("SearchBox:getResults:");
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
		console.log("SearchBox::render, results:");
		console.log(this.state.results);
		return (
			<div className="SearchBox">
				<h1>Search for a shelter, rescue or volunteer group to join</h1>
				<div className="input-group searchInputBox">
					<input type="text" className="form-control"
						   ref="shelterSearchInput"
						   placeholder="Search..."/>
					<span className="input-group-btn">
						<button type="button" className="btn btn-default"
						   onClick={this.shelterSearch}>Go!
						</button>
					</span>
				</div>
				<div>
					<h1>Can't find what you're looking for?
					<Link to="AddNewGroup">Add</Link> your own group!
					</h1>
				</div>
				<ShelterSearchResults results={this.state.results} user={this.state.user}/>
				<AddNewGroupButton user={this.state.user} searchText={this.state.searchText}/>
			</div>
		);
	}
});

module.exports = SearchBox;
