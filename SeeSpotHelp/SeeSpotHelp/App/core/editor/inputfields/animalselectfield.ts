import * as React from 'react';
import Promise = require('bluebird');

import ConstStrings from "../../conststrings";
import InputField from "./inputfield";
import { InputFieldType } from "./inputfield";

import AnimalStore from '../../../stores/animalstore';

// Represents an input form field of the drop down list type.
export default class AnimalSelectField extends InputField {
  public type: InputFieldType = InputFieldType.ANIMAL_SELECT;
  public options: Array<{value: any, name: string}> = [];
  public defaultListItemIndex: number = 0;
  public loading: boolean = false;
  public onLoad: any;

  constructor (validations?) {
    super(validations);
  }

  getDefaultValue() {
      if (this.options.length) {
        return this.options[0].value;
      }
      return null;
  }

  populate(groupId) : Promise<any> {
    this.options = [];
    if (!groupId) return;

    this.loading = true;
    return AnimalStore.ensureItemsByProperty('groupId', groupId).then((animals) => {
      this.loading = false;
      for (var i = 0; i < animals.length; i++) {
        this.options.push({ name: animals[i].name, value: animals[i].id });
      }
      if (this.onLoad) { this.onLoad(); }
    });
  }
}
