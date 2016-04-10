"use strict"

var React = require("react");
var Link = require("react-router").Link;
var AnimalList = require("../animal/animallist");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("./groupinfobox");
var GroupActionsBox = require("./groupactionsbox");
import Volunteer from '../../core/volunteer';
import VolunteerGroup from '../../core/volunteergroup';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import DataServices from '../../core/dataservices';
var AddAnimalButton = require("../animal/addanimalbutton");

var GroupAnimalsTab = React.createClass({
	getInitialState: function () {
		var group = this.props.location &&
					this.props.location.state &&
					this.props.location.state.group ||
					this.props.group;
		return {
			user: LoginStore.getUser(),
			group: group
		}
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			group: nextProps.group
		});
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
	},

	componentWillMount: function () {
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
			});
	},

	render: function () {
		return (
			<div className="shelterAnimalsTab">
				<AddAnimalButton group={this.state.group} user={LoginStore.getUser()}/>
				<br/><br/>
				<AnimalList group={this.state.group} user={LoginStore.getUser()}/>
			</div>
		);
	}
});

module.exports = GroupAnimalsTab;
