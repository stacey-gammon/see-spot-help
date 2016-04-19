'use strict';

import * as React from 'react';

export default class InfoBar extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	render() {
		var mediaLeft = "";
		var mediaCenter = "";
		var mediaRight = "";
		if (this.props.children.length == 1) {
			mediaCenter = this.props.children[1];
		} else if (this.props.children.length >= 2) {
			mediaLeft = this.props.children[0];
			mediaCenter = this.props.children[1];
		}
		if (this.props.children.length == 3) {
			mediaRight = this.props.children[2];
		}
		return (
			<div className='info-top'>
				<div className='media'>
					<div className='media-left'>
						{mediaLeft}
					</div>
					<div className='media-body'>
						{mediaCenter}
					</div>
					<div className='media-right'>
						{mediaRight}
					</div>
				</div>
			</div>
		);
	}
}
