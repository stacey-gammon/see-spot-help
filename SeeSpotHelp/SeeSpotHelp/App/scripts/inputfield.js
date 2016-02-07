var React = require("react");

var ConstStrings = require("./conststrings");

// Represents an input form field.
// @param validations {inputfieldvalidations[]} an array list of input field validations
// that this field should run during the validate call.
var InputField = function (validations) {
    console.log(validations);
    this.hasError = false;
    this.validated = false;
    this.errorMessage = "";
    this.value = "";
    this.validations = validations;
    this.ref = "";
};

InputField.prototype.getUserString = function () {
    return ConstStrings[this.ref.charAt(0).toUpperCase() + this.ref.slice(1)];
};

// Loops through all validations this form field has. The current
// object will be updated depending on success or failure.
InputField.prototype.validate = function () {
    for (var i = 0; i < this.validations.length; i++) {
        this.validations[i](this);
        // Stop after the first error is encountered.
        if (this.hasError) return;
    }
};

// If the field has an error on it, will return an error icon span.
// If the field was validated successfully, will return a span with
// a success mark.  Otherwise returns null.  Note the dom element
// creation is different from the jsx files because this is a plain
// old js file.
InputField.prototype.getValidationSpan = function () {
    if (this.hasError) {
        return React.createElement(
            "span", {
                className: "glyphicon glyphicon-remove form-control-feedback " +
                    this.ref + "ErrorValidationSpan"
            });
    } else if (this.validated) {
        return React.createElement(
            "span", {
                className: "glyphicon glyphicon-ok form-control-feedback " +
                    this.ref + "SuccessValidationSpan"
            });
    } else {
        return null;
    }
};

// If an error occured, returns a dom label with the message, otherwise returns
// null.
InputField.prototype.getErrorLabel = function() {
    if (this.hasError) {
        return React.createElement(
            "label", { className: "control-label", htmlFor: this.ref }, this.errorMessage);
    } else {
        return null;
    }
};

// Returns the classname that should be used on the form-group div that is
// housing this input field.
InputField.prototype.getFormGroupClassName = function () {
    var formName = "";
    if (this.hasError) {
        formName = "form-group has-error has-feedback";
    } else if (this.validated) {
        formName = "form-group has-success has-feedback";
    }
    formName += " " + this.ref + "FormGroup";
    return formName;
};

module.exports = InputField;
