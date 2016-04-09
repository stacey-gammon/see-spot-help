"use strict"

var React = require("react");
var LoginStore = require("../stores/loginstore");
import DataServices = require('../core/dataservices');

var EnterBetaCode = React.createClass({
	getInitialState: function () {
		return {
			error: null
		};
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	componentDidMount: function() {
		LoginStore.addChangeListener(
			this.onChange,
			LoginStore.ChangeEventEnum.LOGGED_IN);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		if (LoginStore.getUser() && LoginStore.getUser().inBeta) {
			this.context.router.push("/profilePage");
		}
	},

	submitBetaCode: function () {
		var betaCode = this.refs.betaCode.value;
		var onSuccess = function (data) {
			var invitesLeft = parseInt(data);
			if (invitesLeft > 0) {
				LoginStore.getUser().inBeta = true;
				LoginStore.getUser().betaCode = betaCode;
				LoginStore.getUser().update();
				invitesLeft -= 1;
				DataServices.SetFirebaseData('inviteCodes/' + betaCode, invitesLeft);
				this.context.router.push("/profilePage");
			} else {
				this.setState({error: true});
			}
		}.bind(this);
		var onError = function () {
			this.setState({error: true});
		}.bind(this);
		new DataServices(onSuccess, onError).GetFirebaseData('inviteCodes/' + betaCode);
	},

	getErrorText: function () {
		if (this.state.error) {
			return (
				<div className="alert alert-danger">
					<strong>Invalid Code</strong>
				</div>
			);
		} else {
			return null;
		}
	},

	render: function () {
		return (<div className="loginPage text-center" style={{margin: '0 auto', maxWidth: '600px', textAlign: 'center'}}>
					<img src="images/logo.png" height="70px"/>
					<br/>
					{this.getErrorText()}
					<div className="text-center" style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
						Invite Code:<br/>
						<input type='text' ref='betaCode'/><br/>
						<button className="btn btn-info" onClick={this.submitBetaCode}>Submit</button>
					</div>
					<br/>
					<br/>
					<p>
						Don't have an invite code? <a link='/privateBetaPage'>Request one!</a>
					</p>
				</div>
		);
	}
});

module.exports = EnterBetaCode;
