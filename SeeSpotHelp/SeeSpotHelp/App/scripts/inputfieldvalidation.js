// A helpful class filled with static functions for validating various
// input fields.
var InputFieldValidation = function() {};

// Makes sure the given input field is does not contain an empty value.
// Updates inputField based on success or failure.
// @param inputField {InputField} - the field to validate.
InputFieldValidation.validateNotEmpty = function(inputField) {
    if (inputField.value == null || inputField.value.trim() == "") {
        inputField.hasError = true;
        inputField.errorMessage = "Field must not be empty.";
    } else {
        inputField.validated = true;
    }
};
