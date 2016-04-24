import * as React from 'react';

import Promise = require('bluebird');

import EditorElement from '../shared/editor/editorelement';

import ActivityEditor from '../../core/editor/activityeditor';
import Activity from '../../core/databaseobjects/activity';
import Utils from '../uiutils';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';
import AnimalActivityStore from '../../stores/animalactivitystore';
import PermissionsStore from '../../stores/permissionsstore';
import StoreStateHelper from '../../stores/storestatehelper';

export default class AddAnimalNote extends React.Component<any, any> {
	public refs: any;
	public context: any;

	constructor(props) {
		super(props);

		var mode = Utils.FindPassedInProperty(this, "mode");
		var animalId = Utils.FindPassedInProperty(this, "animalId");
		var groupId = Utils.FindPassedInProperty(this, "groupId");
		var activityId = Utils.FindPassedInProperty(this, "activityId");

		if (!mode) mode = 'add';

		this.state = {
			animalId: animalId,
			mode: mode,
			groupId: groupId,
			activityId: activityId
		};
		Utils.LoadOrSaveState(this.state);
		if (mode == 'add') this.state.activityId = null;
	}

	// Required for page transitions via this.context.router.push.
	static contextTypes = {
		router: React.PropTypes.object.isRequired
	}

	ensureRequiredState() {
		var promises = [];
		promises.push(GroupStore.ensureItemById(this.state.groupId));
		promises.push(AnimalStore.ensureItemById(this.state.animalId));
		if (this.state.mode == 'edit') {
			promises.push(AnimalActivityStore.ensureItemById(this.state.activityId));
		}

		Promise.all(promises).then(
			function () {
				var group = GroupStore.getGroupById(this.state.groupId);
				var animal = AnimalStore.getItemById(this.state.animalId);
				var activity = AnimalActivityStore.getItemById(this.state.activityId);
				var permission = StoreStateHelper.GetPermission(this.state);
				var editor = new ActivityEditor(activity);
				if (group && animal) {
					this.setState({
						permission: permission,
						editor: editor
					});
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

	componentWillMount() {
		this.ensureRequiredState();
	}

	componentWillUnmount() {
		GroupStore.removeChangeListener(this.onChange);
	}

	onChange() {
		this.forceUpdate();
	}

	goBackToPage() {
		if (this.state.animalId) {
			this.context.router.push(
				{
					pathname: "animalHomePage",
					state: {
						groupId: this.state.groupId,
						animalId: this.state.animalId
					}
				});
		} else {
			this.context.router.push(
				{
					pathname: "groupHomePage",
					state: { groupId: this.state.groupId }
				});
		}
	}

	render() {
		if (!this.state.editor) return null;
		var extraFields = {
			animalId: this.state.animalId,
			groupId: this.state.groupId,
			userId: LoginStore.getUser().id
		}

		var title = this.state.mode == 'add' ?
			'Add a comment' : 'Edit your activity';
		return (
			<EditorElement
				title={title}
				extraFields={extraFields}
				mode={this.state.mode}
				permission={this.state.permission}
				onEditOrInsert={this.goBackToPage.bind(this)}
				onDelete={this.goBackToPage.bind(this)}
				editor={this.state.editor} />
		);
	}
}
