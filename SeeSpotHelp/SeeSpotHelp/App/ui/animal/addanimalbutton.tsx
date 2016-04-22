'use strict';

import * as React from 'react';
var LinkContainer = require('react-router-bootstrap').LinkContainer;

import Permission from '../../core/databaseobjects/permission';

export default class AddAnimalButton extends React.Component<any, any> {
	constructor(props) { super(props); }

	render() {
		if (!this.props.permission.inGroup()) { return null; }

		return (
			<div className='center-block' style={{textAlign: 'center'}}>
				<LinkContainer
					to={{pathname: 'addAnimalPage',
						state: {group: this.props.group,
								permission: this.props.permission,
								mode: 'add'}}}>
					<button className='btn btn-info addAnimalButton padding'>
						Add Animal
					</button>
				</LinkContainer>
			</div>
		);
	}
}
