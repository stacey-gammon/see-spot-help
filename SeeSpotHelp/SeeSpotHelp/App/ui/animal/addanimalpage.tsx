'use strict'

import * as React from 'react';
var TakePhotoButton = require('../takephotobutton');

import EditorElement from '../shared/editor/editorelement';

import AnimalEditor from '../../core/editor/animaleditor';
import ConstStrings from '../../core/conststrings';
import Animal from '../../core/databaseobjects/animal';
import Permission from '../../core/databaseobjects/permission';
import InputField from '../../core/editor/inputfield';
import InputTextAreaField from '../../core/editor/inputtextareafield';
import InputListField from '../../core/editor/inputlistfield';
import InputFieldValidation from '../../core/editor/inputfieldvalidation';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';
import PermissionsStore from '../../stores/permissionsstore';
import StoreStateHelper from '../../stores/storestatehelper';

import Utils from '../uiutils';

export default class AddAnimalPage extends React.Component<any, any> {
	public context: any;
	public refs: any;

	constructor(props) {
		super(props);
		var mode = Utils.FindPassedInProperty(this, 'mode');
		var group = Utils.FindPassedInProperty(this, 'group');
		var animal = Utils.FindPassedInProperty(this, 'animal');

		if (!mode) mode = 'add';

		this.state = {
			errorMessage: null,
			groupId: group.id,
			mode: mode,
			animal: animal
		};

		Utils.LoadOrSaveState(this.state);
	}

	ensureRequiredState() {
		var promises = [];
		promises.push(GroupStore.ensureItemById(this.state.groupId));
		if (this.state.mode == 'edit') {
			promises.push(AnimalStore.ensureItemById(this.state.animal.id));
		}

		Promise.all(promises).then(
			function () {
				var group = GroupStore.getGroupById(this.state.groupId);
				var animal = this.state.mode == 'edit' ? AnimalStore.getItemById(this.state.animal.id) : null;
				var permission = StoreStateHelper.GetPermission(this.state);
				var editor = new AnimalEditor(animal);
				if (group) {
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
		LoginStore.addChangeListener(this.onChange.bind(this));
		if (LoginStore.getUser()) {
			PermissionsStore.addPropertyListener(
				this, 'userId', LoginStore.getUser().id, this.onChange.bind(this));
		}
	}

	componentWillMount() {
		this.ensureRequiredState();
	}

	componentWillUnmount() {
		LoginStore.removeChangeListener(this.onChange);
		PermissionsStore.removePropertyListener(this);
	}

	onChange() {
		var group = this.state.group ? GroupStore.getGroupById(this.state.groupId) : null;
		var permission = StoreStateHelper.GetPermission(this.state);
		this.setState({ permission: permission });
	}

	static contextTypes = {
		router: React.PropTypes.object.isRequired
	}

	goToAnimalPage() {
		this.context.router.push(
			{
				pathname: "animalHomePage",
				state: {
					group: this.state.group,
					animal: this.state.animal,
					user: LoginStore.getUser()
				}
			});
	}

	goToGroupPage() {
		this.context.router.push(
			{
				pathname: "groupHomePage",
				state: {
					groupId: this.state.group.id
				}
			});
	}

	render() {
		if (!this.state.editor) return null;
		var extraFields = {
			groupId: this.state.groupId,
			userId: LoginStore.getUser().id
		}
		Object.assign(extraFields, GroupStore.getGroupById(this.state.groupId));

		return (
			<EditorElement
				extraFields={extraFields}
				mode={this.state.mode}
				permission={this.state.permission}
				onEditOrInsert={this.goToAnimalPage.bind(this)}
				onDelete={this.goToGroupPage.bind(this)}
				editor={this.state.editor} />
		);
	}
}
