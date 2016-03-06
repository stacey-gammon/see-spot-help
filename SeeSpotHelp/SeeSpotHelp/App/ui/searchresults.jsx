var React = require('react');
var Router = require('react-router');
var LinkContainer = require('react-router-bootstrap').LinkContainer;
var LoginStore = require("../stores/loginstore");

var ShelterSearchResults = React.createClass({
	getInitialState: function () {
		return {
			user: LoginStore.getUser()
		}
	},
	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				user: LoginStore.getUser()
			});
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	goToGroup: function(group) {
		console.log("Going to home page for group " + group.id);
		sessionStorage.setItem("defaultGroup", JSON.stringify(group));
		this.context.router.push({ pathname: "/GroupHomePage",
								   query: { groupId: group.id },
								   state: { defaultGroup: group, user: this.state.user } });
	},

	generateResult: function(result) {
		return (
			<button className="btn btn-info shelterResult" onClick={this.goToGroup.bind(this, result)}>
				{result.name} - {result.shelterName} - {result.address}
			</button>
		);
	},

	getLoggedInUser: function() {

	},

	render: function () {
		var items = [];
		for (var groupId in this.props.results) {
			items.push(this.generateResult(this.props.results[groupId]));
		}
		return (
			<div>
				{items}
			</div>
		);
	}
});

module.exports = ShelterSearchResults;
