'use strict'

import * as React from 'react';

// Ui Elements:
import EditorElement from '../shared/editor/editorelement';

// Core components:
import GroupEditor from '../../core/editor/groupeditor';
import Utils from '../uiutils';
import Group from '../../core/databaseobjects/group';
import Permission from '../../core/databaseobjects/permission';

// Stores and store helpers:
import LoginStore from '../../stores/loginstore';
import PermissionsStore from '../../stores/permissionsstore';
import GroupStore from '../../stores/groupstore';
import StoreStateHelper from '../../stores/storestatehelper';

export default class AddNewGroup extends React.Component<any, any> {
  public context: any;
  public refs: any;
  static contextTypes = { router: React.PropTypes.object.isRequired }

  constructor(props) {
    super(props);
    var mode = Utils.FindPassedInProperty(this, 'mode');
    mode = mode ? mode : 'add';
    var groupId = Utils.FindPassedInProperty(this, 'groupId');
    var state = {
      groupId: groupId,
      mode: mode
    };
    Utils.LoadOrSaveState(state);
    // Make sure we don't load a group id from session storage if we are adding a new group.
    if (mode == 'add') state.groupId = null;
    this.state = state;
  }

  componentWillMount() {
    this.ensureRequiredState();
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange);
    PermissionsStore.removePropertyListener(this);
  }

  ensureRequiredState() {
    if (this.state.mode == 'add') {
      this.setState({ editor: new GroupEditor(null) });
      return;
    }
    GroupStore.ensureItemById(this.state.groupId).then(
      function () {
        var group = GroupStore.getGroupById(this.state.groupId);
        var permission = StoreStateHelper.GetPermission(this.state);
      //	var editor = this.state.mode == 'add' ? new GroupEditor(null) : new GroupEditor(group);
        if (group) {
          Utils.SaveProp('groupId', group.id);
          this.setState({ permission: permission, editor: new GroupEditor(group) });
          this.addChangeListeners(group);
        }
      }.bind(this)
    );
  }

  addChangeListeners() {
    LoginStore.addChangeListener(this.onChange);
    if (LoginStore.getUser()) {
      PermissionsStore.addPropertyListener(
        this, 'userId', LoginStore.getUser().id, this.onChange.bind(this));
    }
  }

  onChange() {
    var permission = StoreStateHelper.GetPermission(this.state);
    this.setState({ permission: permission });
  }

  goToGroup() {
    this.context.router.push({
      pathname: 'GroupHomePage',
      state: { groupId:  this.state.editor.databaseObject.id }
    });
  }

  goToProfilePage() {
    this.context.router.push({ pathname: 'profilePage' });
  }

  render() {
    if (!this.state.editor) return null;
    var extraFields = {
      userId: LoginStore.getUser() && LoginStore.getUser().id
    }
    var title = this.state.mode == 'add' ?
      'Add a new group' : 'Edit ' + this.state.editor.databaseObject.name;
    return (
      <EditorElement
        title={title}
        extraFields={extraFields}
        mode={this.state.mode}
        permission={this.state.permission}
        onEditOrInsert={this.goToGroup.bind(this)}
        onDelete={this.goToProfilePage.bind(this)}
        editor={this.state.editor} />
    );
  }
}
