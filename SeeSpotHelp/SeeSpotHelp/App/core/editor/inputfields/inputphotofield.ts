import * as React from 'react';

import ConstStrings from "../../conststrings";
import InputField from "./inputfield";
import { InputFieldType } from "./inputfield";

// Represents an input form field of the drop down list type.
export default class InputPhotoField extends InputField {
  public type: InputFieldType = InputFieldType.PHOTO;
  public src: string = null;

  constructor (src, validations?) {
    super(validations);
    this.src = src;
  }
}
