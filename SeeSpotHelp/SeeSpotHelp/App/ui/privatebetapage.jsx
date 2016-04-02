"use strict"

var React = require("react");

var PrivateBetaPage = React.createClass({
	getSignupForm: function () {
		return (
			<div>
				<div id="mc_embed_signup">
					<form action="//staceygammonpetphotography.us4.list-manage.com/subscribe/post?u=4a8ec322013131b3a2b0b83d1&amp;id=b567aa5e0c" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" novalidate>
						<div id="mc_embed_signup_scroll">
							<input type="email" value="" width="100%" name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required/>
							<div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
								<input type="text" name="b_4a8ec322013131b3a2b0b83d1_b567aa5e0c" tabindex="-1" value=""/></div>
							<div className="clear">
								<input type="submit" value="Sign Up" name="subscribe" id="mc-embedded-subscribe" className="button"/>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	},

	render: function () {
		console.log("PrivateBetaPage::render");
		return (<div className="privateBetaPage text-center">
					<img src="images/logo.png" height="100px"/>
					<div className="betaIntroDiv">
<i>Helping animal rescue volunteers communicate, collaborate & coordinate</i><br/>
<div className="betaPageBold1">Communicate</div>
<div className="betaPageBold2">Collaborate</div>
<div className="betaPageBold3">Coordinate</div>
<br/>
					</div>
					<br/>
					<h2>Sign up to be an early adopter</h2>
					{this.getSignupForm()}

					<p>Already recieved an invite?  <a href="#loginpage">Log in here</a></p>
				</div>
		);
	}
});

module.exports = PrivateBetaPage;
