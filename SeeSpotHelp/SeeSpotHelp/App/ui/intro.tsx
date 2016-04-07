"use strict"

var React = require("react");

var Intro = React.createClass({
	render: function () {
		return (<div className="loginPage" style={{margin: '0 auto', maxWidth: '600px'}}>
					<h1>To get started with The Shelter Helper</h1>
					<br/>
					<p style={{textAlign: 'center'}}><a href="#searchpage">Search Adotpables</a></p>
					<p style={{textAlign: 'center'}}><a href="#searchpage">Search Volunteer Groups</a></p>
					<p style={{textAlign: 'center'}}><a href="#addNewGroup">Start your own volunteer group</a></p>
				</div>
		);
	}
});

module.exports = Intro;
