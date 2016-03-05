"use strict"

var React = require("react");
var ConstStrings = require("../../core/conststrings");
var Animal = require("../../core/animal");
var InputField = require("../../core/inputfield");
var InputFieldValidation = require("../../core/inputfieldvalidation");
var TakePhotoButton = require("../takephotobutton");
var LoginStore = require("../../stores/loginstore");
var Utils = require("../../core/utils");
var GroupActions = require("../../actions/groupactions");

var AddAnimalPage = React.createClass({
    getInitialState: function () {
        console.log("AddAnimalPage::getInitialState");
        // for short hand.
        var IFV = InputFieldValidation;
        var inputFields = {
            "name": new InputField([IFV.validateNotEmpty]),
            "type": new InputField([IFV.validateNotEmpty]),
            "breed": new InputField(),
            "age": new InputField([IFV.validateNumber]),
            "description": new InputField()
        };
        inputFields["description"].type = "textarea";
        inputFields["type"].type = "dropdown";

        inputFields["type"].setListItems([
            "Dog", "Cat", "Other"
        ]);

        // Store the ref name on the input field without manually
        // writing it out twice.
        for (var field in inputFields) {
            inputFields[field].ref = field;
        }

        var editMode = this.props.editMode ? this.props.editMode :
            this.props.location ? this.props.location.state.editMode : null;
        var group = this.props.group ? this.props.group :
            this.props.location ? this.props.location.state.group : null;
        var animal = this.props.animal ? this.props.animal :
            this.props.location ? this.props.location.state.animal : null;

        // If in edit mode, fill in field values.
        if (editMode) {
            for (var field in inputFields) {
                inputFields[field].value = animal[field];
            }
        }

        return {
            errorMessage: null,
            fields: inputFields,
            user : LoginStore.getUser(),
            group: group,
            editMode: editMode,
            animal: animal
        };
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
            if (this.state.editMode) {
                Utils.CopyInputFieldsIntoObject(this.state.fields, this.state.animal);
                this.state.animal.update();
                GroupActions.animalUpdated(this.state.group, this.state.animal);
                this.context.router.push(
                    {
                        pathname: "animalHomePage",
                        state: {
                            group: this.state.group,
                            animal: this.state.animal,
                            user: this.state.user
                        }
                    });
            } else {
                var animal = new Animal();
                animal.groupId = this.state.group.id;
                Utils.CopyInputFieldsIntoObject(this.state.fields, animal);
                animal.insert();
                GroupActions.newAnimalAdded(this.state.group, animal);
                this.context.router.push(
                    {
                        pathname: "GroupHomePage",
                        state: {
                            group: this.state.group,
                            animal: this.state.animal,
                            user: this.state.user
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
        var defaultValue = this.state.editMode ?
            this.state.animal.type : "Dog";
        return (
            <div className="form-group">
              {inputField.getErrorLabel()}
              <select
                  value={defaultValue}
                  className="form-control"
                  style={{marginBottom: -11 + "px"}}
                  id={inputField.ref} ref={inputField.ref}>
                {options}
              </select>
            </div>);
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
        if (inputField.listItems) return this.createDropDown(inputField);
        return (
            <div className={inputField.getFormGroupClassName()}>
                {inputField.getErrorLabel()}
                <div className="input-group">
                    <span className="input-group-addon">{inputField.getUserString()}</span>
                    {this.createInputType(inputField)}
                </div>
                {inputField.getValidationSpan()}
            </div>
        );
    },

    deleteAnimal: function() {
        this.state.animal.delete();
        this.context.router.push(
            {
                pathname: "GroupHomePage",
                state: {
                    group: this.state.group,
                    user: this.state.user
                }
            }
        );
    },

    getDeleteButton: function() {
        if (!this.state.editMode) return null;
        return (
            <button className="btn btn-danger padding pull-right"
                    onClick={this.deleteAnimal}>
                Delete
            </button>
        );
    },

    render: function () {
        console.log("AddAnimalPage: render");
        if (this.state.user == null) {
            throw "Non logged in user is attempting to add a new adoptable";
        }
        var inputFields = [];
        for (var key in this.state.fields) {
            var field = this.state.fields[key];
            inputFields.push(this.createInputField(field));
        }
        var buttonText = this.state.editMode ? ConstStrings.Update : ConstStrings.Add;
        var heading = this.state.editMode ?
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
                    user={this.state.user}
                    group={this.state.group}
                    animal={this.state.animal}/>
                <button className="btn btn-primary padding addAdoptableButton"
                        onClick={this.addNewAnimal}>{buttonText}</button>
                {this.getDeleteButton()}
            </div>
        );
    }
});

module.exports = AddAnimalPage;
