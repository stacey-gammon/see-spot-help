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

export default class AddNewGroup extends React.Component<any, any> {
	public context: any;
	public refs: any;
	static contextTypes = { router: React.PropTypes.object.isRequired }

	constructor(props) {
		super(props);
		var mode = Utils.FindPassedInProperty(this, 'mode');
		var group = Utils.FindPassedInProperty(this, 'group');
		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();

		if (!mode) {
			mode = 'add';
		}

		this.state = {
			editor: new GroupEditor(group),
			group: group,
			mode: mode,
			permission: permission
		};
	}

	componentDidMount() {
		LoginStore.addChangeListener(this.onChange);
		if (LoginStore.getUser()) {
			PermissionsStore.addPropertyListener(
				this, 'userId', LoginStore.getUser().id, this.onChange.bind(this));
		}
		GroupStore.addPropertyListener(this, 'id', this.state.group.id, this.onChange.bind(this));
	}

	componentWillUnmount() {
		LoginStore.removeChangeListener(this.onChange);
		PermissionsStore.removePropertyListener(this);
		GroupStore.removePropertyListener(this);
	}

	onChange() {
		var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();
		this.setState(
			{
				permission: permission,
				group: group
			});
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
