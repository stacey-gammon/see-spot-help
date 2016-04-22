import * as React from 'react';

import ConstStrings from '../../../core/conststrings';
import LoginStore from '../../../stores/loginstore';

export default class AddOrEditButtonBar extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	getDeleteGroupButton() {
		if (this.props.mode == 'add') return null;
		return (
			<button className='btn btn-warning' onClick={this.props.onDelete}>
				Delete
			</button>
		);
	}

	render() {
		var onAddOrEdit = this.props.mode == 'edit' ? this.props.onEdit : this.props.onAdd;
		var addOrEditText = this.props.mode == 'edit' ? ConstStrings.Update : ConstStrings.Add;
		var disabled =
			(this.props.mode == 'edit' && this.props.permission.admin()) ||
			(this.props.mode == 'add' && LoginStore.getUser()) ?
				false : true;
		return (
			<div className='center-block button-bar'>
				<button className='btn btn-info' disabled={disabled} onClick={onAddOrEdit}>
					{addOrEditText}
				</button>
				{this.getDeleteGroupButton()}
			</div>
		);
	}
}
