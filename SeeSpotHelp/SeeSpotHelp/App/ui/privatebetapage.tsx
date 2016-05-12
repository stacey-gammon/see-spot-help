"use strict"

var React = require("react");
import LoginStore from '../stores/loginstore';

var PrivateBetaPage = React.createClass({

  componentWillMount: function () {
    if (LoginStore.getUser() && LoginStore.getUser().inBeta) {
      this.context.router.push('/profilePage');
    }
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getSignupForm: function () {
    return (
      <div>
        <div id="mc_embed_signup">

          <form action="//theshelterhelper.us13.list-manage.com/subscribe/post?u=5074dc4e420d8c33932915cee&amp;id=9a2b83d89e" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
            <div id="mc_embed_signup_scroll">
              <input type="text" width="100%" name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required/>
              <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
                <input type="text" name="b_4a8ec322013131b3a2b0b83d1_b567aa5e0c" tabIndex="-1" value=""/></div>
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
          <br/><br/>
          <p><a href='mailto:info@theshelterhelper.com'>info@theshelterhelper.com</a></p>
        </div>
    );
  }
});

module.exports = PrivateBetaPage;
