import * as React from 'react';

import ConstStrings from "../../conststrings";
import InputField from "./inputfield";
import { InputFieldType } from "./inputfield";

// Represents an input form field of the drop down list type.
export default class InputTextAreaField extends InputField {
  public type: InputFieldType = InputFieldType.TEXT_AREA;

  constructor (validations?) {
    super(validations);
  }
}
