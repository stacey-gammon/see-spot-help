var React = require('react');
var ReactRouterBootstrap = require('react-router-bootstrap');
var ReactBootstrap = require('react-bootstrap');
var LoginStore = require("../stores/loginstore");

var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var NavDropdown = ReactBootstrap.NavDropdown;
var Dropdown = ReactBootstrap.Dropdown;
var MenuItem = ReactBootstrap.MenuItem;
var Glyphicon = ReactBootstrap.Glyphicon;
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var MyNavBar = React.createClass({
	getInitialState: function() {
		return {
			user: LoginStore.getUser()
		}
	},

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
				<Nav className="nav navbar-nav logo-header" style={{display: 'inline-block'}}>
					<NavItem className="nav-item">
						<img src="images/logo.png"/>
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
						<Dropdown.Menu className="dropdownMenuStyle">
							<LinkContainer  to={{ pathname: "userSettingsPage" }}>
								<MenuItem className="dropdownMenuStyle"
										  eventKey={3.1}>Settings</MenuItem>
							</LinkContainer>
						</Dropdown.Menu>
				  </Dropdown>
				</Nav>
			</Navbar>
		);
	}
});

module.exports = MyNavBar;
