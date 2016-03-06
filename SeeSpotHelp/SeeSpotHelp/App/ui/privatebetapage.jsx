"use strict"

var React = require("react");
var Link = require("react-router").Link;
var FakeData = require("../core/fakedata");
var Volunteer = require("../core/volunteer");
var VolunteerGroup = require("../core/volunteergroup");
var FacebookLogin = require("./facebooklogin");
var GroupInfoBox = require("./group/groupinfobox");
var AddNewGroup = require("./group/addnewgroup");
var SearchPage = require("./searchpage");
var LoginStore = require("../stores/loginstore");
var AJAXServices = require("../core/AJAXServices");


var PrivateBetaPage = React.createClass({
	getInitialState: function () {
		return {
			signedUp: false
		}
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	signUp: function () {
		var email = this.refs["email"].value;
		AJAXServices.UpdateFirebaseData("users/" + LoginStore.user.id, { waitingListEmail : email, onWaitingList : true });
		this.setState({signedUp: true});
	},

	getInnerContext: function () {
		var onWaitingListText = ""
		if (LoginStore.user && LoginStore.user.onWaitingList) {
			onWaitingListText = "You are already on the waiting list with email \"" + LoginStore.user.waitingListEmail +
				"\".  If that is incorrect, submit a new email below.";
		}

		if (!this.state.signedUp) {
			return (
			<div> {onWaitingListText}<br/>
			   <input type="text" ref="email"/>
			   <br />
			   <button className="btn btn-primary" onClick={this.signUp}>Enter</button>
			</div>);
		} else {
			return (<div>Thank You!</div>);
		}
	},

	render: function () {
		console.log("PrivateBetaPage::render");
		return (<div className="privateBetaPage text-center">
					<h1>I'm sorry, this application is currently in private beta.&nbsp;
						Enter your email address to be put on the waiting list.</h1>
					<br/>
					{this.getInnerContext()}
				</div>
		);

	}
});

module.exports = PrivateBetaPage;
