var React = require("react");

import ConstStrings from "../../conststrings";

export enum InputFieldType {
  TEXT,
  TEXT_AREA,
  LIST,
  PHOTO,
  AUTO_SUGGEST,
  CHECKBOX,
  DATE,
  TIME,
  GROUP_SELECT,
  ANIMAL_SELECT,
  HIDDEN
}

// Represents an input form field.
// @param validations {inputfieldvalidations[]} an array list of input field validations
// that this field should run during the validate call.
export default class InputField {
  public hasError: boolean = false;
  public validated: boolean = false;
  public errorMessage: string = '';
  public value: string = '';
  public ref: string = '';
  public type: InputFieldType = InputFieldType.TEXT;
  public validations: Array<any> = [];
  public onChange: any;
  public disabled: boolean = false;

  constructor (validations?, type?) {
    this.validations = validations ? validations : [];
    this.type = type ? type : InputFieldType.TEXT;
  }

  getUserString() {
    return ConstStrings[this.ref.charAt(0).toUpperCase() + this.ref.slice(1)];
  }

// Loops through all validations this form field has. The current
// object will be updated depending on success or failure.
  validate() {
    for (var i = 0; i < this.validations.length; i++) {
      this.validations[i](this);
      // Stop after the first error is encountered.
      if (this.hasError) return;
    }
  }

  // If the field has an error on it, will return an error icon span.
  // If the field was validated successfully, will return a span with
  // a success mark.  Otherwise returns null.  Note the dom element
  // creation is different from the jsx files because this is a plain
  // old js file.
  getValidationSpan() {
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
  }

  // If an error occured, returns a dom label with the message, otherwise returns
  // null.
  getErrorLabel() {
    if (this.hasError) {
      return React.createElement(
        "label", { className: "control-label", htmlFor: this.ref }, this.errorMessage);
    } else {
      return null;
    }
  }

  // Returns the classname that should be used on the form-group div that is
  // housing this input field.
  getFormGroupClassName() {
    var formName = "";
    if (this.hasError) {
      formName = "form-group has-error has-feedback";
    } else if (this.validated) {
      formName = "form-group";
    }
    formName += " " + this.ref + "FormGroup";
    return formName;
  }
}
