'use strict'

import * as React from 'react';

import EditorElement from '../shared/editorelement';

import GroupEditor from '../../core/editor/groupeditor';
import Utils from '../../core/utils';
import VolunteerGroup from '../../core/databaseobjects/volunteergroup';
import Permission from '../../core/databaseobjects/permission';

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
		var promises = [];
		promises.push(LoginStore.ensureUser());
		promises.push(GroupStore.ensureItemById(this.state.groupId));

		Promise.all(promises).then(
			function () {
				var group = GroupStore.getGroupById(this.state.groupId);
				var permission = StoreStateHelper.GetPermission(this.state);
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
		return (
			<EditorElement
				mode={this.state.mode}
				permission={this.state.permission}
				onEditOrInsert={this.goToGroup.bind(this)}
				onDelete={this.goToProfilePage.bind(this)}
				editor={this.state.editor} />
		);
	}
}
