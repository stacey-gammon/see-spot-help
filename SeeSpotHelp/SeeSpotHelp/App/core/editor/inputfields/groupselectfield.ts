import * as React from 'react';

import ConstStrings from "../../conststrings";
import InputField from "./inputfield";
import { InputFieldType } from "./inputfield";

import GroupStore from '../../../stores/groupstore';
import LoginStore from '../../../stores/loginstore';
import PermissionsStore from '../../../stores/permissionsstore';
import { Status } from '../../databaseobjects/databaseobject';

// Represents an input form field of the drop down list type.
export default class GroupSelectField extends InputField {
  public type: InputFieldType = InputFieldType.GROUP_SELECT;
  public options: Array<{value: any, name: string}> = [];
  public defaultListItemIndex: number = 0;
  public loading: boolean = true;
  public onLoad: any;

  constructor (validations?) {
    super(validations);
    LoginStore.addChangeListener(this.populate.bind(this));
  }

  getDefaultValue() {
    if (this.options.length) {
      return this.options[0].value;
    }
    return null;
  }

  populate() {
    this.options = [];
    if (!LoginStore.getUser()) { return; }
    this.loading = false;
    PermissionsStore.addPropertyListener(
        this, 'userId', LoginStore.getUser().id, this.populate.bind(this));
    var permissions = PermissionsStore.getPermissionsByUserId(LoginStore.getUser().id)
    this.loading = PermissionsStore.areItemsDownloading('userId', LoginStore.getUser().id);

    var groups = [];
    for (var i = 0; i < permissions.length; i++) {
      if (permissions[i].inGroup) {
        let groupId = permissions[i].groupId;
        GroupStore.addPropertyListener(this, 'id', groupId, this.populate.bind(this));
        let group = GroupStore.getGroupById(groupId);
        if (group && group.status !== Status.ARCHIVED) { groups.push(group); }
        this.loading = this.loading || GroupStore.isItemDownloading(groupId);
      }
    }

    if (!this.loading) {
      for (let i = 0; i < groups.length; i++) {
        this.options.push({ name: groups[i].name, value: groups[i].id });
      }
      if (this.onLoad) { this.onLoad(); }
    }
  }
}
