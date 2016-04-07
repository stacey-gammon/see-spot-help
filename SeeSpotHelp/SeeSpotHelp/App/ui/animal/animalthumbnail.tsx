"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;
var DataServices = require('../../core/dataservices');
var PhotoStore = require('../../stores/photostore');

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

	componentDidMount: function() {
		PhotoStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function() {
		PhotoStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.forceUpdate();
	},

	render: function () {
		var photos = PhotoStore.getPhotosByAnimalId(this.props.animal.id);
		var imageSrc = photos && photos.length > 0 ? photos[0].src : this.props.animal.getPhoto();
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
