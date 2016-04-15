"use strict";

var React = require("react");
var LinkContainer = require('react-router-bootstrap').LinkContainer;

import VolunteerGroup from '../../core/volunteergroup';
import Volunteer from '../../core/volunteer';
import Permission from '../../core/permission';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import PermissionsStore from '../../stores/permissionsstore';

var AddAnimalButton = React.createClass({
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			group: nextProps.group,
			permission: nextProps.permission
		});
	},

	getAddAnimalButton: function() {
		if (!this.props.permission.inGroup()) {
			return null;
		}
		return (
			<div className='center-block' style={{textAlign: 'center'}}>
			<LinkContainer
				to={{pathname: "addAnimalPage",
					state: {group: this.props.group,
							mode: 'add'}}}>
				<button className="btn btn-info addAnimalButton padding">
					Add Animal
				</button>
			</LinkContainer>
			</div>
		);
	},

	render: function() {
		return (
			<div>
				{this.getAddAnimalButton()}
			</div>
		);
	}
});

module.exports = AddAnimalButton;
