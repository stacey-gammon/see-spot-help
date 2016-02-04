var React = require("react");

// Represents an input form field.
// @param validations {inputfieldvalidations[]} an array list of input field validations
// that this field should run during the validate call.
var InputField = function (validations) {
    console.log("InputField, validations = ");
    console.log(validations);
    this.hasError = false;
    this.validated = false;
    this.errorMessage = "";
    this.value = "";
    this.validations = validations;
    this.ref = "";
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
InputField.prototype.getValidationSpan = function() {
    if (this.hasError) {
        return React.createElement(
            "span", { className: "glyphicon glyphicon-remove form-control-feedback" });
    } else if (this.validated) {
        return React.createElement(
            "span", { className: "glyphicon glyphicon-ok form-control-feedback" });
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
InputField.prototype.getFormGroupClassName = function() {
    if (this.hasError) return "form-group has-error has-feedback";
    if (this.validated) return "form-group has-success has-feedback";
    return "";
};

module.exports = InputField;
