import * as React from 'react';
var ReactRouterBootstrap = require('react-router-bootstrap');
var ReactBootstrap = require('react-bootstrap');
import LoginStore from '../stores/loginstore';
import FacebookLogin from "./facebooklogin";

var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var NavDropdown = ReactBootstrap.NavDropdown;
var Dropdown = ReactBootstrap.Dropdown;
var MenuItem = ReactBootstrap.MenuItem;
var Glyphicon = ReactBootstrap.Glyphicon;
var LinkContainer = ReactRouterBootstrap.LinkContainer;

export default class MyNavBar extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    LoginStore.addChangeListener(this.onChange);
  }
  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.forceUpdate();
  }

  goToAboutPage() {
    window.location.href = "http://www.theshelterhelper.com";
  }

  // Code to put the logo back in the nav bar.  I'm uncertain if I like it there so I took it out.
  // <Nav className="nav navbar-nav logo-header" style={{display: 'inline-block'}}>
  //   <NavItem className="nav-item">
  //     <img src="images/logo.png"/>
  //   </NavItem>
  // </Nav>

  // Code to put back settings link.  The page isn't ready yet so hiding.
  // <LinkContainer to={{ pathname: "userSettingsPage" }}>
  //   <MenuItem eventKey={3.1}>Settings</MenuItem>
  // </LinkContainer>

  render() {
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
              <MenuItem eventKey={3.3} onClick={this.goToAboutPage.bind(this)}>About Us</MenuItem>
              <LinkContainer to={{ pathname: "loginPage", state: { logout: true }}}>
                <MenuItem eventKey={3.2}>Log out</MenuItem>
              </LinkContainer>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>
    );
  }
}
