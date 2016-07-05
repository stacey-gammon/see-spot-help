"use strict";

import Group from '../core/databaseobjects/group';
import Animal from '../core/databaseobjects/animal';
import DatabaseObject from '../core/databaseobjects/databaseobject';
import { Status } from '../core/databaseobjects/databaseobject';

import DataServices from '../core/dataservices';
import VolunteerStore from "../stores/volunteerstore";
import PermissionsStore from "../stores/permissionsstore";

import BaseStore from './basestore';

class GroupStore extends BaseStore {
  protected databaseObject: DatabaseObject = new Group();

  constructor() {
    super();

    this.Init();
  }

  getGroupById(groupId) {
    return this.getItemById(groupId);
  }

  getGroupsByUser(user, listener) {
    if (!user) return null;
    var groupsForUser = [];
    var permissions = PermissionsStore.getPermissionsByUserId(user.id);
    if (!permissions) return null;

    for (var i = 0; i < permissions.length; i++) {
      if (permissions[i].inGroup() || permissions[i].pending()) {
        let groupId = permissions[i].groupId;
        var group = this.storage[groupId];
        if (!group && !this.isItemDownloading(groupId)) {
          this.addChangeListener(listener);
          this.downloadItem(permissions[i].groupId);
        } else if (group && group.status != Status.ARCHIVED) {
          groupsForUser.push(this.storage[permissions[i].groupId]);
        }
      }
    }
    return groupsForUser;
  }

  groupAdded(snapshot) {
    if (snapshot.val()) {
      var group = Group.castObject(snapshot.val());
      // Wait for the subsequent update to set the id.
      if (!group.id) return;
      this.storage[group.id] = group;
      this.emitChange();
    }
  }
}

export default new GroupStore();
