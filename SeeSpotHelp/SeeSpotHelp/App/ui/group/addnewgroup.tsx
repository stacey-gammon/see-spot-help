"use strict"

var React = require("react");
import ConstStrings = require("../../core/conststrings");
var Utils = require("../../core/utils");
var VolunteerGroup = require("../../core/volunteergroup");
import InputField = require("../../core/inputfield");
import InputFieldValidation = require("../../core/inputfieldvalidation");
var LoginStore = require("../../stores/loginstore");
var GroupActions = require("../../actions/groupactions");

var STATES = [
	"AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
	"ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
	"MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR",
	"PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

var AddNewGroup = React.createClass({
	getInitialState: function() {
		// for short hand.
		var IFV = InputFieldValidation;
		var inputFields = {
			"name": new InputField([IFV.validateNotEmpty]),
			"shelter": new InputField([IFV.validateNotEmpty]),
			"address": new InputField([IFV.validateNotEmpty]),
			"city": new InputField([IFV.validateNotEmpty]),
			"state": new InputField([IFV.validateNotEmpty]),
			"zipCode": new InputField([IFV.validateNotEmpty])
		};
		// Store the ref name on the input field without manually
		// writing it out twice.
		for (var field in inputFields) {
			inputFields[field].ref = field;
		}

		var mode = Utils.FindPassedInProperty(this, 'mode');
		var group = Utils.FindPassedInProperty(this, 'group');

		if (!mode) {
			mode = 'add';
		}

		// If in edit mode, fill in field values.
		if (mode == 'edit') {
			for (var field in inputFields) {
				inputFields[field].value = group[field];
			}
		}

		return {
			fields: inputFields,
			user : LoginStore.getUser(),
			group: group,
			mode: mode
		};
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	validateFields: function() {
		var errorFound = false;
		for (var key in this.state.fields) {
			var field = this.state.fields[key];
			field.value = this.refs[field.ref].value;
			field.validate();
			if (field.hasError) {
				console.log("Error found with field " + field.ref);
				errorFound = true;
			}
		}
		// Forces a re-render based on the new validation states for each
		// field.
		if (errorFound) {
			console.log("Error found!");
			this.setState({ fields: this.state.fields });
		}
		return errorFound;
	},

	insertGroupCallback: function(group) {
		GroupActions.newGroupAdded(group);
		this.context.router.push(
			{
				pathname: "GroupHomePage",
				state: {
					group:  group
				}
			});
	},

	addNewVolunteerGroup: function() {
		var errorFound = this.validateFields();
		if (!errorFound) {
			if (this.state.mode == 'edit') {
				this.state.group.updateFromInputFields(this.state.fields);
				this.state.group.update();
				this.insertGroupCallback(this.state.group);
				GroupActions.groupUpdated(this.state.group);
			} else {
				var group = VolunteerGroup.createFromInputFields(
					this.state.fields,
					this.state.user.id);
				group.insert(this.state.user);
				this.insertGroupCallback(group);
			}
		}
	},

	createInputField: function(inputField) {
		var inputFieldClassName = "form-control " + inputField.ref;
		return (
			<div className={inputField.getFormGroupClassName()}>
				{inputField.getErrorLabel()}
				<div className="input-group">
					<span className="input-group-addon">{inputField.getUserString()}</span>
					<input type="text"
						   ref={inputField.ref}
						   id={inputField.ref}
						   className={inputFieldClassName}
						   defaultValue={inputField.value}/>
				</div>
				{inputField.getValidationSpan()}
			</div>
		);
	},

	deleteGroup: function() {
		if (confirm("WAIT! Are you sure you want to permanently delete this group?")) {
			this.state.group.delete();
			GroupActions.groupDeleted(this.state.group);
		}
	},

	getDeleteGroupButton: function() {
		if (this.state.mode == 'add') return null;
		return (
			<button className="btn btn-warning" onClick={this.deleteGroup}>
				Delete
			</button>
		);
	},

	render: function() {
		if (this.state.user == null) {
			throw "Non logged in user is attempting to add a new shelter";
		}
		var inputFields = [];
		for (var key in this.state.fields) {
			var field = this.state.fields[key];
			inputFields.push(this.createInputField(field));
		}
		var buttonText = this.state.mode == 'edit' ? ConstStrings.Update : ConstStrings.Add;
		return (
			<div>
				{this.state.errorMessage}
				{inputFields}
				<div style={{textAlign: 'center'}}
					 className="center-block">
					<button className="btn btn-info"
						onClick={this.addNewVolunteerGroup}>{buttonText}
					</button>
					{this.getDeleteGroupButton()}
				</div>
			</div>
		);
	}
});

module.exports = AddNewGroup;
