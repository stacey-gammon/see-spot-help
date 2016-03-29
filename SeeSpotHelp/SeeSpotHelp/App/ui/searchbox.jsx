"use strict";

var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var Link = require("react-router").Link;
var Utils = require("../core/utils");
var Animal = require("../core/animal");
var LinkContainer = require("react-router-bootstrap").LinkContainer;
var ShelterSearchResults = require("./searchresults");
var LoginStore = require("../stores/loginstore");
var DataServices = require("../core/dataservices");
var DropdownMenu = ReactBootstrap.DropdownMenu;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var DropdownButton = ReactBootstrap.DropdownButton;
var Button = ReactBootstrap.Button;
var MenuItem = ReactBootstrap.MenuItem;

var SearchBox = React.createClass({
	getInitialState: function() {
		var state = {
			results: {},
			searchForValue: 'groups',
			searchOnType: 'Name'
		}

		Utils.LoadOrSaveState(state);
		return state;
	},

	getResults: function(results) {
		this.setState({
			results: results
		});
	},

	shelterSearch: function() {
		var searchFor = this.state.searchForValue;
		const stringToGroupAttribute = {
			'zip code': 'zipCode'
		};
		var searchOn = this.state.searchOnType.toLowerCase();
		if (stringToGroupAttribute[searchOn]) {
			searchOn = stringToGroupAttribute[searchOn];
		}
		var searchText = this.refs.groupSearchInput.value;

		DataServices.startStringSearch(searchFor, searchOn, searchText, this.getResults);
	},

	onSearchForChange: function () {
		var searchOnType = this.state.searchOnType;
		if (this.refs.searchFor.value == 'animal') {
			searchOnType = 'Zip Code';
		} else {
			searchOnType = 'Name';
		}
		this.setState({
			searchForValue: this.refs.searchFor.value,
			searchOnType: searchOnType
		});
	},

	getSearchForDropDown: function () {
		return (
			<select defaultValue={this.state.searchForValue} className="form-control"
					ref='searchFor' id='searchFor'
					onChange={this.onSearchForChange}>
				<option value='groups'>Volunteer Group</option>
				<option value='animals'>Adoptable</option>
			</select>
		);
	},

	setSearchOnType: function (value) {
		this.setState({searchOnType: value});
	},

	getSearchOnGroupDropDown: function (number) {
		var id = "groupInput" + number;
		var groupId = "groupSearchOn" + number;
		return (
			<div className="input-group" ref={groupId}>
				<div className="input-group-btn">
	  			  <DropdownButton title={this.state.searchOnType} id="bg-nested-dropdown">
	  		        <MenuItem eventKey="1" onClick={this.setSearchOnType.bind(this, 'Name')}>Name</MenuItem>
	  		        <MenuItem eventKey="2" onClick={this.setSearchOnType.bind(this, 'Shelter')}>Shelter</MenuItem>
	  		        <MenuItem eventKey="2" onClick={this.setSearchOnType.bind(this, 'City')}>City</MenuItem>
	  		        <MenuItem eventKey="2" onClick={this.setSearchOnType.bind(this, 'State')}>State</MenuItem>
	  		        <MenuItem eventKey="2" onClick={this.setSearchOnType.bind(this, 'Zip Code')}>Zip Code</MenuItem>
	  		      </DropdownButton>
			  	</div>
				<input type="text" style={{marginTop: '3px'}} className="form-control" ref="groupSearchInput"/>
			</div>
		);
	},

	createOption: function (option) {
		return (
			<option value={option}>{option}</option>
		);
	},

	getAnimalTypeDropDown: function () {
		var options = Animal.GetTypeOptions().map(this.createOption);
		return (
			<select className="form-control"
					ref='animalTypeOption' id='animalTypeOption'>
				{options}
			</select>
		);
	},

	getAnimalBreedInput: function () {
		var options = Animal.GetTypeOptions().map(this.createOption);
		return (
			<div className="input-group">
				<span className="input-group-addon">Breed</span>
				<input type="text" className="form-control"
					ref="animalBreed"/>
			</div>
		);
	},

	getAnimalSearchOnInputField: function () {
		return (
			<div className="input-group" ref="animalSearchOn">
				<div className="input-group-btn">
	  			  <DropdownButton title={this.state.searchOnType} id="bg-nested-dropdown">
	  		        <MenuItem eventKey="2" onClick={this.setSearchOnType.bind(this, 'Breed')}>Breed</MenuItem>
	  		        <MenuItem eventKey="2" onClick={this.setSearchOnType.bind(this, 'Shelter')}>Shelter</MenuItem>
	  		        <MenuItem eventKey="2" onClick={this.setSearchOnType.bind(this, 'City')}>City</MenuItem>
	  		        <MenuItem eventKey="2" onClick={this.setSearchOnType.bind(this, 'State')}>State</MenuItem>
	  		        <MenuItem eventKey="2" onClick={this.setSearchOnType.bind(this, 'Zip Code')}>Zip Code</MenuItem>
	  		      </DropdownButton>
			  	</div>
				<input type="text" style={{marginTop: '3px'}} className="form-control" ref="groupSearchInput"/>
			</div>
		);
	},

	getSearchOnAnimalFields: function () {
		return (
			<div>
				<div className="input-group">
					<span className="input-group-addon">Type</span>
					{this.getAnimalTypeDropDown()}
				</div>
				{this.getAnimalSearchOnInputField()}
			</div>
		);
	},

	getSearchOnFields: function () {
		if (this.state.searchForValue == 'groups') {
			return this.getSearchOnGroupDropDown();
		} else {
			return this.getSearchOnAnimalFields();
		}
	},

	render: function() {
		return (
			<div className="SearchBox">
				<div className="input-group">
					<span className="input-group-addon">Search For</span>
					{this.getSearchForDropDown()}
				</div>
				{this.getSearchOnFields()}
				<div className="input-group searchInputBox">
					<button type="button" className="btn btn-default"
						onClick={this.shelterSearch}>Go!
					</button>
				</div>
				<div>
					<br/>
					<h1>Can't find what you're looking for?&nbsp;
					<Link to="AddNewGroup">Add</Link> your own group!
					</h1>
				</div>
				<ShelterSearchResults results={this.state.results} type={this.state.searchForValue}/>
			</div>
		);
	}
});

module.exports = SearchBox;
