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

    validateFields: function() {
        for (var field in this.state.fields) {
            this.state.fields[field].validate();
        }
        // Forces a re-render based on the new validation states for each
        // field.
        this.setState({ fields: this.state.fields });
    },

    addNewVolunteerGroup: function() {
        var values = {};
        var errorsFound = false;
        for (var i = 0; i < this.state.fields.length; i++) {
            var field = this.state.fields[i];
            if (!this.refs[field].value) {
                this.setState({ errorMessage: "Please fill in all fields!" });
                errorsFound = true;
            } else {
                values[field] = this.refs[field].value;
            }
        }
        if (!errorsFound) {
            this.setState({ errorMessage: null });
        }
        var group = new VolunteerGroup(values["groupName"],
                                       values["shelterName"],
                                       values["address"]);
        group.addNewVolunteerGroup();
    },

    createInputField: function (inputField) {
        console.log("AdNewShelter::createInputField");
        var inputFieldClassName = "form-control " + inputField.ref;
        return (
            <div className={inputField.getFormGroupClassName()}>
                {inputField.getErrorLabel()}
                <div className="input-group">
                    <span className="input-group-addon">{ConstStrings[inputField.ref]}</span>
                    <input type="text" ref={inputField.ref} id={inputField.ref} className={inputFieldClassName} />
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
                    <button className="btn btn-primary" onClick={this.addNewVolunteerGroup}>Add Group</button>
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
