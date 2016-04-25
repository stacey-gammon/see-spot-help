'use strict'

import * as React from 'react';
var Slider = require('react-slick');

import LoginStore from '../../stores/loginstore';
import PhotoStore from '../../stores/photostore';

export default class AnimalPhotoReel extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		PhotoStore.addPropertyListener(
			this, 'animalId', this.props.animal.id, this.forceUpdate.bind(this));
	}

	componentWillUnmount() {
		PhotoStore.removePropertyListener(this);
	}

	generateImage(photo) {
		return (
			<div><img className="slider-img" src={photo.src}/></div>
		);
	}

	render() {
		var photos = PhotoStore.getPhotosByAnimalId(this.props.animal.id);
		if (!photos || photos.length == 0) return null;

		var photoImgs = [];
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
}
