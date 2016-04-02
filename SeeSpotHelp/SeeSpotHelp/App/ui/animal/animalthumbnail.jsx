"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;
var DataServices = require('../../core/dataservices');

// A small representation of an animal to be displayed in the animal
// list. Clicking on the thumbnail will direct the user to the chosen
// animals home page.
var AnimalThumbnail = React.createClass({
	getInitialState: function() {
		return {
			imageSrc: null
		}
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	loadAnimalPhoto: function (data) {
		this.setState({imageSrc: data});
	},

	render: function () {
		var imageSrc = this.state.imageSrc || this.props.animal.getPhoto();
		if (!this.state.imageSrc && this.props.animal.photoIds.length > 0) {
			new DataServices(this.loadAnimalPhoto).GetFirebaseData(
				'photos/' + this.props.animal.photoIds[0] + '/filePayload');
		}
		return (
			<a href="#" className="list-group-item animalListElement">
				<LinkContainer to={{ pathname: "animalHomePage" ,
							   state: { user: this.props.user, group: this.props.group, animal: this.props.animal} }}>
					<div className="media">
						<div className="media-left">
							<img className="media-object" src={imageSrc} height="100px" width="100px"/>
						</div>
						<div className="media-body">
							<h4 className="media-heading">{this.props.animal.name}</h4>
							<div className="animalThumbnailText">{this.props.animal.status}</div>
							<div className="animalThumbnailText">{this.props.animal.breed}</div>
							<div className="animalThumbnailText">{this.props.animal.age} years old</div>
						</div>
					</div>
				</LinkContainer>
			</a>
		);
	}
});

module.exports = AnimalThumbnail;
