'use strict';

import * as React from 'react';

import Utils from '../../uiutils';
import Photo from '../../../core/databaseobjects/photo';
import LoginStore from '../../../stores/loginstore';
import PhotoStore from '../../../stores/photostore';

export default class PhotoTab extends React.Component<any, any> {
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
	render() {
		if (!this.props.group && this.props.memberId < 0) return null;
		return (
			<div>
				
			</div>
		);
	}
}
