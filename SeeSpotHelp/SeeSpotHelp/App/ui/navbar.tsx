var React = require('react');
var ReactRouterBootstrap = require('react-router-bootstrap');
var ReactBootstrap = require('react-bootstrap');
import LoginStore from '../stores/loginstore';
var FacebookLogin = require("./facebooklogin");

var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var NavDropdown = ReactBootstrap.NavDropdown;
var Dropdown = ReactBootstrap.Dropdown;
var MenuItem = ReactBootstrap.MenuItem;
var Glyphicon = ReactBootstrap.Glyphicon;
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var MyNavBar = React.createClass({
  componentDidMount: function () {
    LoginStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function () {
    LoginStore.removeChangeListener(this.onChange);
  },

  onChange: function () {
    this.forceUpdate();
  },

  // Code to put the logo back in the nav bar.  I'm uncertain if I like it there so I took it out.
  // <Nav className="nav navbar-nav logo-header" style={{display: 'inline-block'}}>
  //   <NavItem className="nav-item">
  //     <img src="images/logo.png"/>
  //   </NavItem>
  // </Nav>

  render: function() {
    return (
      <Navbar ref="mynavbar" className="navbar navbar-light bg-faded sh-navbar">
        <Nav className="nav navbar-nav navbar-custom">
          <NavItem className="nav-item" href="#groupHomePage">
            <span className="glyphicon glyphicon-home nav-item" />
          </NavItem>
          <NavItem className="nav-item" href="#profilePage">
            <span className="glyphicon glyphicon-user nav-item" />
          </NavItem>
          <NavItem className="nav-item" href="#searchPage">
            <span className="glyphicon glyphicon-search nav-item" />
          </NavItem>
        </Nav>
        <Nav pullRight style={{display: 'inline-block'}}>
          <Dropdown componentClass="li" id="settingsMenu">
            <Dropdown.Toggle
              className="dropdownToggleStyle"
              hidden="true"
              noCaret={true}>
              <button className="hamburgerDropdown">
                <span className="glyphicon glyphicon-cog nav-item" />
              </button>
            </Dropdown.Toggle>
            <Dropdown.Menu className="sh-dropdown-menu">
              <LinkContainer  to={{ pathname: "userSettingsPage" }}>
                <MenuItem eventKey={3.1}>Settings</MenuItem>
              </LinkContainer>
              <MenuItem eventKey={3.2}>
                <FacebookLogin displayInline="true"/>
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>
    );
  }
});

module.exports = MyNavBar;
