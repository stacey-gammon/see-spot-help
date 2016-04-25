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
		if (!Array.isArray(this.props.children)) {
			mediaCenter = this.props.children;
		} else if (this.props.children.length >= 2) {
			mediaLeft = this.props.children[0];
			mediaCenter = this.props.children[1];
		}
		if (this.props.children.length == 3) {
			mediaRight = this.props.children[2];
		}

		var additionalChildren = [];
		for (var i = 3; i < this.props.children.length; i++) {
			additionalChildren.push(this.props.children[i]);
		}

		var className = this.props.noTabs ? 'info-top-no-tabs' : 'info-top';

		return (
			<div className={className}>
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
				{additionalChildren}
			</div>
		);
	}
}
