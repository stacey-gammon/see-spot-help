import * as React from 'react';

import Promise = require('bluebird');

import EditorElement from './shared/editor/editorelement';

import PhotoEditor from '../core/editor/photoeditor';
import Photo from '../core/databaseobjects/photo';
import Utils from './uiutils';
import LoginStore from '../stores/loginstore';
import GroupStore from '../stores/groupstore';
import AnimalStore from '../stores/animalstore';
import PhotoStore from '../stores/photostore';
import PermissionsStore from '../stores/permissionsstore';
import StoreStateHelper from '../stores/storestatehelper';

export default class AddPhotoPage extends React.Component<any, any> {
	public refs: any;
	public context: any;

	constructor(props) {
		super(props);

		var mode = Utils.FindPassedInProperty(this, 'mode');
		var animalId = Utils.FindPassedInProperty(this, 'animalId');
		var groupId = Utils.FindPassedInProperty(this, 'groupId');
		var photo = Utils.FindPassedInProperty(this, 'photo');
		var headShot = Utils.FindPassedInProperty(this, 'headShot');

		if (!mode) mode = 'add';

		this.state = {
			animalId: animalId,
			mode: mode,
			groupId: groupId,
			photo: photo,
			headShot: headShot
		};
	}

	// Required for page transitions via this.context.router.push.
	static contextTypes = {
		router: React.PropTypes.object.isRequired
	}

	ensureRequiredState() {
		var promises = [];
		promises.push(GroupStore.ensureItemById(this.state.groupId));
		promises.push(AnimalStore.ensureItemById(this.state.animalId));

		Promise.all(promises).then(
			function () {
				var group = GroupStore.getGroupById(this.state.groupId);
				var animal = AnimalStore.getItemById(this.state.animalId);
				var permission = StoreStateHelper.GetPermission(this.state);
				var editor = new PhotoEditor(this.state.photo);
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
					pathname: 'animalHomePage',
					state: {
						groupId: this.state.groupId,
						animalId: this.state.animalId
					}
				});
		} else {
			this.context.router.push(
				{
					pathname: 'groupHomePage',
					state: { groupId: this.state.groupId }
				});
		}
	}

	render() {
		if (!this.state.editor) return null;
		var extraFields = {
			animalId: this.state.animalId,
			groupId: this.state.groupId,
			headShot: this.state.headShot,
			src: this.state.src,
			userId: LoginStore.getUser().id
		}

		var title = this.state.mode == 'add' ?
			'Add a photo' : 'Edit your photo';
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
