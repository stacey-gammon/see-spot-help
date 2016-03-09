"use strict";

var React = require("react");
var Link = require("react-router").Link;
var LinkContainer = require("react-router-bootstrap").LinkContainer;
var ShelterSearchResults = require("./searchresults");
var LoginStore = require("../stores/loginstore");
var DataServices = require("../core/dataservices");

var AddNewGroupButton = React.createClass({
	getInitialState: function () {
		return {}
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		forceUpdate();
	},

	render: function() {
		var disabled = !LoginStore.getUser();
		var disabledDiv = "";
		if (disabled) {
			disabledDiv = (<div>*You must be logged in to add a new group</div>);
		}
		if (this.props.searchText) {
			return (
				<div>
					<LinkContainer to={{ pathname: "AddNewGroup" }} disabled={disabled}>
						<button className="btn btn-warning shelterResult AddNewGroupButton">
							Add New Group
						</button>
					</LinkContainer>
					{disabledDiv}
				</div>
			);
		} else return (<div/>);
	}
});

var SearchBox = React.createClass({
	getInitialState: function() {
		return {
			results: {}
		}
	},

	getResults: function(results) {
		this.setState({
			results: results
		});
	},

	shelterSearch: function() {
		var searchText = this.refs.shelterSearchInput.value;
		DataServices.startStringSearch("groups", "name", searchText, this.getResults);
	},

	render: function() {
		return (
			<div className="SearchBox">
				<h1>Search for a volunteer group</h1>
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
					<br/>
					<h1>Can't find what you're looking for?&nbsp;
					<Link to="AddNewGroup">Add</Link> your own group!
					</h1>
				</div>
				<ShelterSearchResults results={this.state.results} />
				<AddNewGroupButton searchText={this.state.searchText}/>
			</div>
		);
	}
});

module.exports = SearchBox;
