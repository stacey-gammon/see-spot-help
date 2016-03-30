'use strict'

var React = require('react');
var AnimalThumbnail = require('./animalthumbnail');
var GroupStore = require("../../stores/groupstore");
var AnimalStore = require("../../stores/animalstore");

// A list of animals managed by the current volunteer group.
var AnimalList = React.createClass({
	generateAnimal: function (animal) {
		return (
			<AnimalThumbnail animal={animal} user={this.props.user} group={this.props.group }/>
		);
	},
	componentDidMount: function () {
		AnimalStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		AnimalStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.forceUpdate();
	},

	render: function () {
		if (!this.props.group) return null;
		var animals = AnimalStore.getAnimalsByGroupId(this.props.group.id);
		if (!animals) return null;
		var animalsUiElements = [];
		for (var i = 0; i < animals.length; i++) {
			animalsUiElements.push(this.generateAnimal(animals[i]));
		}
		return (
			<div className="list-group">
				{animalsUiElements}
			</div>
		);
	}
});

module.exports = AnimalList;
