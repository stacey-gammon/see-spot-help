'use strict'

import * as React from 'react';

import InputFields from '../shared/inputfields';
import AddOrEditButtonBar from '../shared/addoreditbuttonbar';

import ConstStrings from '../../core/conststrings';
import Utils from '../../core/utils';
import VolunteerGroup from '../../core/databaseobjects/volunteergroup';
import Permission from '../../core/databaseobjects/permission';
import InputField from '../../core/inputfield';
import InputFieldValidation from '../../core/inputfieldvalidation';
import LoginStore from '../../stores/loginstore';
import PermissionsStore from '../../stores/permissionsstore';
import GroupStore from '../../stores/groupstore';

var STATES = [
	'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI',
	'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
	'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR',
	'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

var AddNewGroup = React.createClass({
	getInitialState: function() {
		// for short hand.
		var IFV = InputFieldValidation;
		var inputFields = {
			'name': new InputField([IFV.validateNotEmpty]),
			'shelter': new InputField([IFV.validateNotEmpty]),
			'address': new InputField([IFV.validateNotEmpty]),
			'city': new InputField([IFV.validateNotEmpty]),
			'state': new InputField([IFV.validateNotEmpty]),
			'zipCode': new InputField([IFV.validateNotEmpty])
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
		if (LoginStore.getUser()) {
			PermissionsStore.addPropertyListener(
				this, 'userId', LoginStore.getUser().id, this.onChange.bind(this));
		}
		GroupStore.addPropertyListener(this, 'id', this.state.group.id, this.onChange.bind(this));
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		PermissionsStore.removePropertyListener(this);
		GroupStore.removePropertyListener(this);
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
			field.validate();
			if (field.hasError) {
				console.log('Error found with field ' + field.ref);
				errorFound = true;
			}
		}
		// Forces a re-render based on the new validation states for each
		// field.
		if (errorFound) {
			console.log('Error found!');
			this.setState({ fields: this.state.fields });
		}
		return !errorFound;
	},

	goToGroup: function(group) {
		this.context.router.push({
			pathname: 'GroupHomePage',
			state: { groupId:  group.id }
		});
	},

	editGroup: function() {
		this.refs.inputFields.fillWithValues(this.state.fields);
		if (!this.validateFields()) {
			this.state.group.updateFromInputFields(this.state.fields);
			this.state.group.update();
			this.goToGroup(this.state.group);
		}
	},

	addGroup: function() {
		this.refs.inputFields.fillWithValues(this.state.fields);
		if (!this.validateFields()) {
			var group = VolunteerGroup.createFromInputFields(
				this.state.fields,
				this.state.user.id);
			group.insert(this.state.user);
			this.goToGroup(group);
		}
	},

	deleteGroup: function() {
		if (confirm('WAIT! Are you sure you want to permanently delete this group?')) {
			this.state.group.delete();
		}
	},

	render: function() {
		return (
			<div>
				{this.state.errorMessage}
				<InputFields ref='inputFields' fields={this.state.fields}/>
				<AddOrEditButtonBar
					mode={this.state.mode}
					permission={this.state.permission}
					onAdd={this.addGroup.bind(this)}
					onEdit={this.editGroup.bind(this)}
					onDelete={this.deleteGroup.bind(this)}/>
			</div>
		);
	}
});

module.exports = AddNewGroup;
