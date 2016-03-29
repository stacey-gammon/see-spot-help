var React = require('react');
var Router = require('react-router');
var LinkContainer = require('react-router-bootstrap').LinkContainer;
var LoginStore = require("../stores/loginstore");
var GroupListItem = require("./group/grouplistitem");
var AnimalThumbnail = require("./animal/animalthumbnail");

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

	generateResult: function(result) {
		if (this.props.searchForValue == 'groups') {
			return (
				<GroupListItem group={result} user={LoginStore.getUser()}/>
			);
		} else {
			return (
				<AnmimalThumbnail animal={result} user={LoginStore.getUser()}/>
			);
		}
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
