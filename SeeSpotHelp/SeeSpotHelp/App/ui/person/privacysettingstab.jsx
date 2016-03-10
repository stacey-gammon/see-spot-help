"use strict"

var React = require("react");
var Link = require("react-router").Link;
var Volunteer = require("../../core/volunteer");
var FacebookLogin = require("../facebooklogin");
var LoginStore = require("../../stores/loginstore");

var PrivacySettingsTab = React.createClass({
	getInitialState: function() {
		return {
			updated: false
		}
	},

	updateSettings: function() {
		var privacyOptions = this.getPrivacyOptions();
		for (var i = 0; i < privacyOptions.length; i++) {
			var selectedVal = "";
			var selected = $("input[type='radio'][name='" + privacyOptions[i].id + "']:checked");
			if (selected.length > 0) {
			    selectedVal = selected.val();
			}
			LoginStore.user[privacyOptions[i].id] = selectedVal;
		}
		LoginStore.user.update();
		this.props.onChange();
	},

	createPrivacyOptions: function(option) {
		return (
			<div data-toggle="buttons" style={{margin: '10px 5px 3px 5px'}}>
				<p>{option.displayName}</p>
				<input type="radio" name={option.id} value='public'
					defaultChecked={!LoginStore.user[option.id] || LoginStore.user[option.id] == 'public'}
					style={{margin: '5px 5px 5px 5px'}}/>
				Public
				<input type="radio" name={option.id} value='group'
					defaultChecked={LoginStore.user[option.id] == 'group'}
					style={{margin: '5px 5px 5px 15px'}}/>
				Group members
				<input type="radio" name={option.id} value='me'
					defaultChecked={LoginStore.user[option.id] == 'me'}
					style={{margin: '5px 5px 5px 15px'}}/>
				Only me
			</div>
		);
	},

	getPrivacyOptions: function() {
		return [
			{
				id: 'privacySettingEmail',
				displayName: 'Contact information (email)'
			}
		];
	},

	render: function () {
		if (!LoginStore.user) return null;
		var displayName = LoginStore.user.displayName ?
			LoginStore.user.displayName : LoginStore.user.name;
		var privacyElements = this.getPrivacyOptions().map(this.createPrivacyOptions);
		return (
			<div>
				<br/>
				{privacyElements}
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

module.exports = PrivacySettingsTab;