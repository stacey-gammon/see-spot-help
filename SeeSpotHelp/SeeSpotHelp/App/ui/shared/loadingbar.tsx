'use strict'

import * as React from 'react';

export default class LoadingBar extends React.Component<any, any> {

	render () {
		return (
			<div className="text-center active">
				<span className="spinner"><i className='fa fa-sinner fa-spin'></i></span>
			</div>
			);
	}
}
