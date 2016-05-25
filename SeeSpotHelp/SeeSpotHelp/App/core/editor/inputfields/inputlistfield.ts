import * as React from 'react';

import ConstStrings from "../../conststrings";
import InputField from "./inputfield";
import { InputFieldType } from "./inputfield";

// Represents an input form field of the drop down list type.
export default class InputListField extends InputField {
  public type: InputFieldType = InputFieldType.LIST;
  public listItems: Array<any> = [];
  public defaultListItemIndex: number = 0;

  constructor (listItems, validations?) {
    super(validations);
    this.listItems = listItems;
  }

  getDefaultValue() {
    return this.listItems[this.defaultListItemIndex];
  }
}
