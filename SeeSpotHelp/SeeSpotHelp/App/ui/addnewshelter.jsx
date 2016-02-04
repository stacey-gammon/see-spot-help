"use strict"

var React = require("react");
var ConstStrings = require("../scripts/conststrings");
var VolunteerGroup = require("../scripts/volunteergroup");
var InputField = require("../scripts/inputfield");
var InputFieldValidation = require("../scripts/inputfieldvalidation");

var STATES = [
    "AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
    "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
    "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR",
    "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

var AddNewShelter = React.createClass({
    getInitialState: function () {
        console.log("AddNewShelter::getInitialState");
        // for short hand.
        var IFV = InputFieldValidation;
        var inputFields = {
            "groupName": new InputField([IFV.validateNotEmpty]),
            "shelterName": new InputField([IFV.validateNotEmpty]),
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

        return {
            errorMessage: null,
            fields: inputFields
        };
    },

    validateFields: function () {
        var errorFound = false;
        for (var key in this.state.fields) {
            var field = this.state.fields[key];
            field.value = this.refs[field.ref].value;
            field.validate();
            if (field.hasError) {
                errorFound = true;
            }
        }
        // Forces a re-render based on the new validation states for each
        // field.
        if (errorFound) {
            this.setState({ fields: this.state.fields });
        }
        return errorFound;
    },

    insertGroupCallBack: function (group, serverResponse) {
        if (serverResponse.hasError) {
            // Show error message to user.
            this.setState({ errorMessage: serverResponse.errorMessage });
        } else {
            // TODO: Navigate to newly inserted group home page.
            this.setState({ errorMessage: "Success!" });
        }
    },

    addNewVolunteerGroup: function () {
        var errorFound = this.validateFields();
        if (!errorFound) {
            var group = VolunteerGroup.createFromInputFields(this.state.fields);
            group.insert(this.insertGroupCallback);
        }
    },

    createInputField: function (inputField) {
        console.log("AdNewShelter::createInputField");
        var inputFieldClassName = "form-control " + inputField.ref;
        return (
            <div className={inputField.getFormGroupClassName()}>
                {inputField.getErrorLabel()}
                <div className="input-group">
                    <span className="input-group-addon">{ConstStrings[inputField.ref]}</span>
                    <input type="text"
                           ref={inputField.ref}
                           id={inputField.ref}
                           className={inputFieldClassName} />
                </div>
                {inputField.getValidationSpan()}
            </div>
        );
    },

    render: function () {
        console.log("AddNewShelter: render");
        var user = this.props.user ? this.props.user : this.state.user ? this.state.user :
                   this.props.location ? this.props.location.state : null;
        if (user == null) {
            throw "Non logged in user is attempting to add a new shelter";
        }
        var inputFields = [];
        for (var key in this.state.fields) {
            var field = this.state.fields[key];
            inputFields.push(this.createInputField(field));
        }
        if (user) {
            return (
                <div>
                    {this.state.errorMessage}
                    {inputFields}
                    <button className="btn btn-primary addNewGroupButton"
                            onClick={this.addNewVolunteerGroup}>Add Group</button>
                </div>
            );
        } else {
            return (
                <div>
                    <h1>You need to log in to be able to add a new group.</h1>
                </div>
            );
        }
    }
});

module.exports = AddNewShelter;
