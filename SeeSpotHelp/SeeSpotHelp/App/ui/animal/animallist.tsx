'use strict'

var React = require('react');
var AnimalThumbnail = require('./animalthumbnail');
import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';

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
			<div className="groupList">
				{animalsUiElements}
			</div>
		);
	}
});

module.exports = AnimalList;
