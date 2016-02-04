"use strict"

var React = require("react");
var ConstStrings = require("../scripts/conststrings");
var VolunteerGroup = require("../scripts/volunteergroup");

var STATES = [
    "AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
    "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
    "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR",
    "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

var AddNewShelter = React.createClass({
    getInitialState: function() {
        return {
            errorMessage: null,
            fields: ["groupName", "shelterName", "address", "city", "state", "zipCode"]
        };
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

    createInputField: function (name) {
        return (
            <div className="input-group">
                <span className="input-group-addon">{ConstStrings[name]}</span>
                <input type="text" ref={name} className="form-control"/>
            </div>
        );
    },

    render: function () {
        var user = this.props.location.state;
        var inputFields = [];
        for (var i = 0; i < this.state.fields.length; i++) {
            var field = this.state.fields[i];
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
