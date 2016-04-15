"use strict"

var React = require("react");
var Slider = require('react-slick');
var TakePhotoButton = require("../takephotobutton");

import LoginStore from '../../stores/loginstore';
import PhotoStore from '../../stores/photostore';

var LeftNavButton = React.createClass({
  render() {
    return <button>Prev</button>
  }
});

var RightNavButton = React.createClass({
  render() {
    return <button>Next</button>
  }
});

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

	generateImage: function (photo) {
		return (
			<div><img className="slider-img" src={photo.src}/></div>
		);
	},

	getAddPhotoButton: function () {
		var style = {height: '30px', width: '40px', margin: '5px'};
		return (
			<div style={{vertialAlign: 'middle'}}>
				<TakePhotoButton
					group={this.props.group}
					style={style}
					user={LoginStore.getUser()}
					permission={this.props.permission}
					animal={this.props.animal}/>
			</div>
		);
	},

	render: function () {
		console.log("AnimalPhotoReel::render");
		var photos = PhotoStore.getPhotosByAnimalId(this.props.animal.id);
		var photoImgs = [];
		//photoImgs.push(this.getAddPhotoButton());
		for (var i = 0; i < photos.length; i++) {
			photoImgs.push(this.generateImage(photos[i]));
		}
		var settings = {
			dots: false,
			arrows: true,
			infinite: false,
			centerMode: false,
			swipe: true,
			slidestoScroll: 1,
			slidesToShow: 3,
			variableWidth: true,
			adaptiveHeight: false
		};
		return (
			<div className="photo-slider">
				<Slider {...settings}>
					{photoImgs}
				</Slider>
			</div>
		);
	}
});

module.exports = AnimalPhotoReel;
