"use strict"

var React = require("react");
var ConstStrings = require("../scripts/conststrings");
var Animal = require("../scripts/animal");
var InputField = require("../scripts/inputfield");
var InputFieldValidation = require("../scripts/inputfieldvalidation");
var TakePhotoButton = require("./takephotobutton");

var AddAdoptablePage = React.createClass({
    getInitialState: function () {
        console.log("AddAdoptablePage::getInitialState");
        // for short hand.
        var IFV = InputFieldValidation;
        var inputFields = {
            "name": new InputField([IFV.validateNotEmpty]),
            "type": new InputField([IFV.validateNotEmpty]),
            "breed": new InputField(),
            "age": new InputField()
        };
        // Store the ref name on the input field without manually
        // writing it out twice.
        for (var field in inputFields) {
            inputFields[field].ref = field;
        }
        
        var editMode = this.props.editMode ? this.props.editMode :
            this.props.location ? this.props.location.state.editMode : null;
        var user = this.props.user ? this.props.user :
            this.props.location ? this.props.location.state.user : null;
        var group = this.props.group ? this.props.group :
            this.props.location ? this.props.location.state.group : null;
        var animal = this.props.animal ? this.props.animal :
            this.props.location ? this.props.location.state.group : null;

        // If in edit mode, fill in field values.
        if (editMode) {
            for (var field in inputFields) {
                inputFields[field].value = animal[field];
            }
        }

        return {
            errorMessage: null,
            fields: inputFields,
            user : user,
            group: group,
            editMode: editMode,
            animal: animal
        };
    },

    validateFields: function () {
        console.log("AddAdoptablePage::validateFields");
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

    insertGroupCallback: function (group, serverResponse) {
        console.log("AddAdoptablePage::insertGroupCallback");
        if (serverResponse.hasError) {
            // Show error message to user.
            this.setState({ errorMessage: serverResponse.errorMessage });
        } else {
            // TODO: Navigate to newly inserted group home page.
            this.setState({ errorMessage: "Success!" });
        }
    },

    addNewAnimal: function () {
        console.log("AddAdoptablePage:addNewAnimal");
        var errorFound = this.validateFields();
        if (!errorFound) {
            if (this.state.editMode) {
                this.state.animal.copyFieldsFrom(this.state.fields);
                this.state.animal.update(this.insertGroupCallback);
            } else {
                var animal = Animal.castObj(this.state.fields);
                animal.insert(this.insertGroupCallback);
            }
        }
    },

    createInputField: function (inputField) {
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

    render: function () {
        console.log("AddAdoptablePage: render");
        if (this.state.user == null) {
            throw "Non logged in user is attempting to add a new adoptable";
        }
        var inputFields = [];
        for (var key in this.state.fields) {
            var field = this.state.fields[key];
            inputFields.push(this.createInputField(field));
        }
        var buttonText = this.state.editMode ? ConstStrings.Update : ConstStrings.Add;
        return (
            <div>
                {this.state.errorMessage}
                {inputFields}
                <TakePhotoButton user={this.state.user} group={this.state.group} animal={this.state.animal}/>
                <button className="btn btn-primary addAdoptableButton"
                        onClick={this.addAdoptable}>{buttonText}</button>
            </div>
        );
    }
});

module.exports = AddAdoptablePage;
