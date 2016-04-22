// A helpful class filled with static functions for validating various
// input fields.
export default class InputFieldValidation {

	// Makes sure the given input field is does not contain an empty value.
	// Updates inputField based on success or failure.
	// @param inputField {InputField} - the field to validate.
	public static validateNotEmpty(inputField) {
		if (inputField.value == null || inputField.value.trim() == "") {
			inputField.hasError = true;
			inputField.errorMessage = "Field must not be empty.";
		} else {
			inputField.validated = true;
			inputField.hasError = false;
			inputField.errorMessage = "";
		}
	};

	// Makes sure the given input field is a number.
	// Updates inputField based on success or failure.
	// @param inputField {InputField} - the field to validate.
	public static validateNumber(inputField) {
		var number = Number(inputField.value);
		if (!number && inputField.value) {
			inputField.hasError = true;
			inputField.errorMessage = "Field has to be a number.";
		} else {
			inputField.validated = true;
			inputField.hasError = false;
			inputField.errorMessage = "";
			inputField.value = number;
		}
	}
}
