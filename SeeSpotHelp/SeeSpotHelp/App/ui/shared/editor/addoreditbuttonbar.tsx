import * as React from 'react';

import ConstStrings from '../../../core/conststrings';
import LoginStore from '../../../stores/loginstore';

export default class AddOrEditButtonBar extends React.Component<any, any> {
	public context: any;
	static contextTypes = { router: React.PropTypes.object.isRequired }
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

	cancel() {
		this.context.router.goBack();
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
				<button className='btn btn-info' disabled={disabled} onClick={this.cancel.bind(this)}>
					Cancel
				</button>
			</div>
		);
	}
}
