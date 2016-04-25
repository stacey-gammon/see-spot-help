'use strict';

import * as React from 'react';

export default class ActionsBar extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='container-fluid'>
				<div className='row text-right'>
					{this.props.children}
				</div>
			</div>
		);
	}
}
