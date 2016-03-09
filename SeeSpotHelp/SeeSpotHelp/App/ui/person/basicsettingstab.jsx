"use strict"

var React = require("react");
var Link = require("react-router").Link;
var Volunteer = require("../../core/volunteer");
var FacebookLogin = require("../facebooklogin");
var LoginStore = require("../../stores/loginstore");

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
		LoginStore.user.name = this.refs.name.value;
		LoginStore.user.displayName = this.refs.displayName.value;
		LoginStore.email = this.refs.email.value;
		LoginStore.user.update();
		this.props.onChange();
	},

	render: function () {
		if (!LoginStore.user) return null;
		var displayName = LoginStore.user.displayName ?
			LoginStore.user.displayName : LoginStore.user.name;
		return (
			<div>
				<br/>
				<div className="input-group">
					<span className="input-group-addon">Email: </span>
					<input type="text"
					   ref="email"
					   className="form-control"
					   defaultValue={LoginStore.user.email}/>
				</div>
				<div className="input-group">
					<span className="input-group-addon">Name: </span>
					<input type="text"
						   ref="name"
						   className="form-control"
						   defaultValue={LoginStore.user.name}/>
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
