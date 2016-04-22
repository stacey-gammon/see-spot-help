import * as React from 'react';

import Promise = require('bluebird');

import AnimalNote from '../../core/databaseobjects/animalnote';
import Utils from '../../core/utils';
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
				if (group && animal) {
					this.setState({
						permission: permission
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

	submitNote() {
		if (this.state.mode == 'edit') {
			this.state.activity.note = this.refs.note.value;
			this.state.activity.update();
		} else {
			var note = new AnimalNote();
			note.note = this.refs.note.value;
			note.animalId = this.state.animal.id;
			note.groupId = this.state.group.id;
			note.userId = this.state.user.id;
			note.insert();
		}

		if (this.state.animal) {
			this.context.router.push(
				{
					pathname: "animalHomePage",
					state: {
						group: this.state.group,
						animal: this.state.animal,
						user: this.state.user
					}
				});
		} else {
			this.context.router.push(
				{
					pathname: "groupHomePage",
					state: { groupId: this.state.group.id }
				});
		}
	}

	render() {
		var value = this.state.mode == 'edit' ? this.state.activity.note : "";
		var buttonText = this.state.mode == 'edit' ? "Update" : "Post";
		var headerText = this.state.mode == 'edit' ?
			'Update your post about ' + this.state.animal.name :
			'Make a post about ' + this.state.animal.name;
		return (
			<div>
				<h1>{headerText}</h1>
				<div className="center-block padding">
					<textarea
						className="form-control padding center-block PostTextArea"
						ref="note"
						rows="5"
						id="comment"
						defaultValue={value}>
					</textarea>
					<div style={{textAlign: 'center'}}>
					<button className="btn btn-info" onClick={this.submitNote}>
						{buttonText}
					</button>
					</div>
				</div>
			</div>
		);
	}
}
