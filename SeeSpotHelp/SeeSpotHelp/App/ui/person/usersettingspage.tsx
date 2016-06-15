"use strict"

var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;

import BasicSettingsTab from './basicsettingstab';
var PrivacySettingsTab = require("./privacysettingstab");

import Volunteer from '../../core/databaseobjects/volunteer';
import LoginStore from '../../stores/loginstore';

var UserSettingsPage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      updated: false
    }
  },

  settingsUpdated: function() {
    this.setState({
      updated: true
    });
  },

  render: function () {
    // There is no user and none is going to be downloaded, we must prompt them to log in.
    // TODO: when we open the app up to the public, we must be able to handle non-logged in
    // users.
    if (!LoginStore.getUser() && !LoginStore.userDownloading) {
      this.context.router.push("/loginpage");
    }
    var header = this.state.updated ? "Settings Updated!" : "Settings";

    if (LoginStore.getUser()) {
      return (
        <div>
          <div className="media padding">
            <div className="media-body">
            <h1>{header}</h1>
            </div>
          </div>
          <Tabs defaultActiveKey={1}>
            <Tab eventKey={1} title="Basic">
              <BasicSettingsTab onChange={this.settingsUpdated}/>
            </Tab>
            <Tab eventKey={2} title="Privacy">
              <PrivacySettingsTab onChange={this.settingsUpdated}/>
            </Tab>
          </Tabs>
          <br/><br/>
        </div>
      );
    }
    return null;
  }
});

module.exports = UserSettingsPage;
