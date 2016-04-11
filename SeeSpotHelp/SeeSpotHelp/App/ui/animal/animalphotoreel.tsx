"use strict"

var React = require("react");
var TakePhotoButton = require("../takephotobutton");

import LoginStore from '../../stores/loginstore';

var AnimalPhotoReel = React.createClass({
	getInitialState: function() {
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
		this.forceUpdate();
	},

	render: function () {
		console.log("AnimalPhotoReel::render");
		return (
			<div className="animalPhotoReel" >
				<TakePhotoButton
					group={this.props.group}
					user={LoginStore.getUser()}
					permission={this.props.permission}
					animal={this.props.animal}/>
			</div>
		);
	}
});

module.exports = AnimalPhotoReel;