import * as React from 'react';

import ConstStrings from "../../conststrings";
import InputField from "./inputfield";
import { InputFieldType } from "./inputfield";

import AnimalStore from '../../../stores/animalstore';

// Represents an input form field of the drop down list type.
export default class AnimalSelectField extends InputField {
  public type: InputFieldType = InputFieldType.ANIMAL_SELECT;
  public options: Array<{value: any, name: string}> = [];
  public defaultListItemIndex: number = 0;
  public loading: boolean = true;
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

  populate(groupId) {
    this.options = [];
    if (!groupId) return;
    this.loading = false;
    AnimalStore.addPropertyListener(this, 'groupId', groupId, this.populate.bind(this, groupId));
    var animals = AnimalStore.getAnimalsByGroupId(groupId);

    this.loading = AnimalStore.areItemsDownloading('groupId', groupId);

    if (!this.loading) {
      for (var i = 0; i < animals.length; i++) {
        this.options.push({ name: animals[i].name, value: animals[i].id });
      }
      if (this.onLoad) { this.onLoad(); }
    }
  }
}
