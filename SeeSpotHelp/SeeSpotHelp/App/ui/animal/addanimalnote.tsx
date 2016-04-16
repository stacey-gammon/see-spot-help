var React = require("react");

import AnimalNote from '../../core/animalnote';
import Utils from '../../core/utils';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';

var AddAnimalNote = React.createClass({
	getInitialState: function() {
		var mode = Utils.FindPassedInProperty(this, "mode");
		var animal = Utils.FindPassedInProperty(this, "animal");
		var group = Utils.FindPassedInProperty(this, "group");
		var activity = Utils.FindPassedInProperty(this, "activity");
		var user = LoginStore.getUser();

		if (!mode) mode = 'add';

		return {
			user: user,
			animal: animal,
			mode: mode,
			group: group,
			activity: activity
		};
	},

	// Required for page transitions via this.context.router.push.
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	// Listen for changes made to the group in case the user was banned or membership was approved,
	// we'll need up update the actions they can use.
	componentDidMount: function() {
		GroupStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function() {
		GroupStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		var user = LoginStore.getUser();
		var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		this.setState(
			{
				user: user,
				group: group
			});
	},

	submitNote: function() {
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
	},

	render: function() {
		console.log("AddAnimalNote:render:");
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
});

module.exports = AddAnimalNote;
