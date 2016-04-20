"use strict"

var React = require("react");
var Link = require("react-router").Link;
var FacebookLogin = require("../facebooklogin");

import LoginStore from '../../stores/loginstore';
import Volunteer from '../../core/databaseobjects/volunteer';

var BasicSettingsTab = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			updated: false
		}
	},

	updateSettings: function() {
		LoginStore.getUser().name = this.refs.name.value;
		LoginStore.getUser().displayName = this.refs.displayName.value;
		LoginStore.getUser().email = this.refs.email.value;
		LoginStore.getUser().update();
		this.props.onChange();
	},

	render: function () {
		if (!LoginStore.getUser()) return null;
		var displayName = LoginStore.getUser().displayName ?
			LoginStore.getUser().displayName : LoginStore.getUser().name;
		return (
			<div>
				<br/>
				<div className="input-group">
					<span className="input-group-addon">Email: </span>
					<input type="text"
					   ref="email"
					   className="form-control"
					   defaultValue={LoginStore.getUser().email}/>
				</div>
				<div className="input-group">
					<span className="input-group-addon">Name: </span>
					<input type="text"
						   ref="name"
						   className="form-control"
						   defaultValue={LoginStore.getUser().name}/>
				</div>
				<div className="input-group">
					<span className="input-group-addon">Display Name: </span>
					<input type="text"
						   ref="displayName"
						   className="form-control"
						   defaultValue={displayName}/>
				</div>
				<p>* Supply a display name if you would like to protect your privacy</p>
				<br/>
				<div style={{textAlign: 'center'}}>
					<button className="btn btn-info" onClick={this.updateSettings}>
						Update
					</button>
					<FacebookLogin displayInline="true"/>

				</div>
			</div>
		);
	}
});

module.exports = BasicSettingsTab;
