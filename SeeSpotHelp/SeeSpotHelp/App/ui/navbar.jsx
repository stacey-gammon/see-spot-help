var React = require('react');
var ReactRouterBootstrap = require('react-router-bootstrap');
var ReactBootstrap = require('react-bootstrap');
var FacebookLogin = require('./facebooklogin');
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
	getInitialState: function () {
		return {
			user: LoginStore.getUser()
		}
	},

	componentDidMount: function () {
	  //  LoginStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		//LoginStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				user: LoginStore.getUser()
			});
	},

	render: function() {
		console.log("MyNavBar::render , user = ");
		console.log(this.state.user);
		return (
			<Navbar ref="mynavbar" className="navbar navbar-light bg-faded">
				<Nav className="nav navbar-nav navbar-custom">
					<LinkContainer to={{ pathname: "groupHomePage", state: { user: this.state.user } }}>
						<NavItem>
							<span className="glyphicon glyphicon-home" />
						</NavItem>
					</LinkContainer>
					<LinkContainer to={{ pathname: "profilePage", state: { user: this.state.user } }}>
						<NavItem>
							<span className="glyphicon glyphicon-user" />
						</NavItem>
					</LinkContainer>
					<LinkContainer  to={{ pathname: "searchPage", state: { user: this.state.user } }}>
					<NavItem>
						<span className="glyphicon glyphicon-search" />
					</NavItem>
					</LinkContainer>
					</Nav>
					<Nav pullRight>
						<Dropdown componentClass="li">
							<Dropdown.Toggle
								className="dropdownToggleStyle"
								hidden="true"
								noCaret="true">
								<button className="hamburgerDropdown">
									<span className="glyphicon glyphicon-cog" />
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
