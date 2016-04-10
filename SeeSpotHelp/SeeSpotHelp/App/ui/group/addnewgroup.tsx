"use strict"

var React = require("react");

import ConstStrings from '../../core/conststrings';
import Utils from '../../core/utils';
import VolunteerGroup from '../../core/volunteergroup';
import Permission from '../../core/permission';
import InputField from '../../core/inputfield';
import InputFieldValidation from '../../core/inputfieldvalidation';
import LoginStore from '../../stores/loginstore';
import PermissionsStore from '../../stores/permissionsstore';
import GroupStore from '../../stores/groupstore';

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
		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();

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
			mode: mode,
			permission: permission
		};
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	componentDidMount: function() {
		LoginStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();
		this.setState(
			{
				permission: permission,
				group: group
			});
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
		var inputFields = [];
		for (var key in this.state.fields) {
			var field = this.state.fields[key];
			inputFields.push(this.createInputField(field));
		}
		var buttonText = this.state.mode == 'edit' ? ConstStrings.Update : ConstStrings.Add;
		var disabled =
			(this.state.mode == 'edit' && this.state.permission.admin()) ||
			(this.state.mode == 'add' && LoginStore.getUser()) ?
				false : true;
		return (
			<div>
				{this.state.errorMessage}
				{inputFields}
				<div style={{textAlign: 'center'}}
					 className="center-block">
					<button className="btn btn-info" disabled={disabled}
						onClick={this.addNewVolunteerGroup}>{buttonText}
					</button>
					{this.getDeleteGroupButton()}
				</div>
			</div>
		);
	}
});

module.exports = AddNewGroup;
