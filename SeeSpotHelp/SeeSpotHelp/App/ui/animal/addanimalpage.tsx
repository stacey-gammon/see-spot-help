"use strict"

var React = require("react");
var ConstStrings = require("../../core/conststrings");
var Animal = require("../../core/animal");
var Permission = require("../../core/permission");
var InputField = require("../../core/inputfield");
var InputFieldValidation = require("../../core/inputfieldvalidation");
var TakePhotoButton = require("../takephotobutton");
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import PermissionsStore from '../../stores/permissionsstore';

import Utils from '../../core/utils';
var GroupActions = require("../../actions/groupactions");

var AddAnimalPage = React.createClass({
	getInitialState: function () {
		// for short hand.
		var IFV = InputFieldValidation;
		var inputFields = {
			"name": new InputField([IFV.validateNotEmpty]),
			"type": new InputField([IFV.validateNotEmpty]),
			"status": new InputField([IFV.validateNotEmpty]),
			"breed": new InputField(),
			"age": new InputField([IFV.validateNumber]),
			"description": new InputField()
		};
		inputFields["description"].type = "textarea";
		inputFields["type"].type = "dropdown";

		inputFields["type"].setListItems([
			"Dog", "Cat", "Other"
		]);

		inputFields["status"].setListItems([
			"Adoptable", "Rescue Only", "Adopted", "Rescued", "PTS", "No long living"
		]);

		// Store the ref name on the input field without manually
		// writing it out twice.
		for (var field in inputFields) {
			inputFields[field].ref = field;
		}

		var mode = Utils.FindPassedInProperty(this, 'mode');
		var group = Utils.FindPassedInProperty(this, 'group');
		var animal = Utils.FindPassedInProperty(this, 'animal');
		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();

		if (!mode) mode = 'add';
		// If in edit mode, fill in field values.
		if (mode == 'edit') {
			for (var field in inputFields) {
				inputFields[field].value = animal[field];
			}
		}

		var state = {
			errorMessage: null,
			fields: inputFields,
			group: group,
			mode: mode,
			permission: permission,
			animal: animal
		};

		Utils.LoadOrSaveState(state);
		return state;
	},

	componentDidMount: function() {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		var permission = LoginStore.getUser() && this.state.group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, this.state.group.id) :
			Permission.CreateNonMemberPermission();
		this.setState(
			{
				group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null,
				permission: permission
			});
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	validateFields: function () {
		console.log("AddAnimalPage::validateFields");
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

	addNewAnimal: function () {
		console.log("AddAnimalPage:addNewAnimal");
		var errorFound = this.validateFields();
		if (!errorFound) {
			if (this.state.mode == 'edit') {
				Utils.CopyInputFieldsIntoObject(this.state.fields, this.state.animal);
				this.state.animal.CopyGroupFields(this.state.group);
				this.state.animal.update();
				GroupActions.animalUpdated(this.state.group, this.state.animal);
				this.context.router.push(
					{
						pathname: "animalHomePage",
						state: {
							group: this.state.group,
							animal: this.state.animal,
							user: LoginStore.getUser()
						}
					});
			} else {
				var animal = new Animal();
				animal.groupId = this.state.group.id;
				Utils.CopyInputFieldsIntoObject(this.state.fields, animal);
				animal.CopyGroupFields(this.state.group);
				animal.insert();
				GroupActions.newAnimalAdded(this.state.group, animal);
				this.context.router.push(
					{
						pathname: "GroupHomePage",
						state: {
							group: this.state.group,
							animal: this.state.animal,
							user: LoginStore.getUser()
						}
					}
				);
			}
		}
	},

	createTypeOption: function (option) {
		return (
			<option value={option}>{option}</option>
		);
	},

	createDropDown: function (inputField) {
		var options = inputField.listItems.map(this.createTypeOption);
		var defaultValue = this.state.mode == 'edit' ?
			this.state.animal.type : "Dog";
		return (
			<select
				  defaultValue={defaultValue}
				  className="form-control"
				  id={inputField.ref} ref={inputField.ref}>
				{options}
			</select>);
	},

	createInputType: function (inputField) {
		var inputFieldClassName = "form-control " + inputField.ref;
		if (inputField.type == "text") {
			return (
				<input type="text"
				   ref={inputField.ref}
				   id={inputField.ref}
				   className={inputFieldClassName}
				   defaultValue={inputField.value}/>);
	   } else if (inputField.type == "textarea") {
		   return (
			   <textarea
				  ref={inputField.ref}
				  id={inputField.ref}
				  className={inputFieldClassName}
				  defaultValue={inputField.value}/>);
	   }
	},

	createInputField: function (inputField) {
		var inputBox = inputField.listItems ?
			this.createDropDown(inputField) : this.createInputType(inputField);
		return (
			<div className={inputField.getFormGroupClassName()}
				style={{marginBottom: 2 + "px"}}>
				{inputField.getErrorLabel()}
				<div className="input-group">
					<span className="input-group-addon">{inputField.getUserString()}</span>
					{inputBox}
				</div>
				{inputField.getValidationSpan()}
			</div>
		);
	},

	deleteAnimal: function() {
		if (confirm("Are you sure you want to permanently delete this animal?")) {
			this.state.animal.delete();
			this.context.router.push(
				{
					pathname: "GroupHomePage",
					state: {
						group: this.state.group,
						user: LoginStore.getUser()
					}
				}
			);
		}
	},

	getDeleteButton: function() {
		if (this.state.mode == 'add') return null;
		return (
			<button className="btn btn-warning"
					onClick={this.deleteAnimal}>
				Delete
			</button>
		);
	},

	render: function () {
		if (LoginStore.getUser() == null) return null;
		var inputFields = [];
		for (var key in this.state.fields) {
			var field = this.state.fields[key];
			inputFields.push(this.createInputField(field));
		}
		var buttonText = this.state.mode == 'edit' ? ConstStrings.Update : ConstStrings.Add;
		var heading = this.state.mode == 'edit' ?
			"Edit " + this.state.animal.name :
			"Add a new adoptable!"
		return (
			<div>
				<div className="padding">
					<h1>{heading}</h1>
				</div>
				{this.state.errorMessage}
				{inputFields}
				<TakePhotoButton
					user={LoginStore.getUser()}
					group={this.state.group}
					animal={this.state.animal}
					permission={this.state.permission}/>
				<div style={{textAlign: 'center'}}>
				<button className="btn btn-info padding AddAnimalButton"
						onClick={this.addNewAnimal}>{buttonText}</button>
				{this.getDeleteButton()}
				</div>
			</div>
		);
	}
});

module.exports = AddAnimalPage;
