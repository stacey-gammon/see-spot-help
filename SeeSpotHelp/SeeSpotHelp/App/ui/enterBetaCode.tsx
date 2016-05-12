"use strict"

var React = require("react");
import LoginStore from '../stores/loginstore';
import DataServices from '../core/dataservices';

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
    LoginStore.addLoggedInChangeListener(this.onChange);
  },

  componentWillUnmount: function () {
    LoginStore.removedLoggedInChangeListener(this.onChange);
  },

  onChange: function () {
    if (LoginStore.getUser() && LoginStore.getUser().inBeta) {
      this.context.router.push("/profilePage");
    }
  },

  submitBetaCode: function () {
    var betaCode = this.refs.betaCode.value;
    var onSuccess = function (data) {
      var invitesLeft = parseInt(data.val());
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
    DataServices.DownloadDataOnce('inviteCodes/' + betaCode, onSuccess, onError);
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
    return (
      <div className="loginPage text-center" style={{margin: '0 auto', maxWidth: '600px', textAlign: 'center'}}>
        <div className='header-bar'>
          <img src="images/logo.png" height="70px"/>
        </div>
        <div className='login-page'>
          <br/>
          {this.getErrorText()}
          <div className="text-center" style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
            <h3>Enter Invite Code</h3>
            <input className='form-control' type='text' ref='betaCode' placeholder='Enter code here'/>
            <button className="btn btn-info btn-big" onClick={this.submitBetaCode}>Submit</button>
          </div>
          <br/>
          <br/>
          <p>
            Don't have an invite code? <a href="http://www.theshelterhelper.com/#signup">Request one!</a>
          </p>
        </div>
      </div>
    );
  }
});

module.exports = EnterBetaCode;
