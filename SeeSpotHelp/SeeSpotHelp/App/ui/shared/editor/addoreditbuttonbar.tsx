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
    if (this.props.mode == 'add' || !this.props.permission) return null;
    var deleteDisabled = this.props.mode == 'edit' && !this.props.permission.admin();
    return (
      <button className='btn btn-warning' onClick={this.props.onDelete} disabled={deleteDisabled}>
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
    var editDisabled = false;
    if (this.props.permission) {
      editDisabled =
        (this.props.mode == 'edit' && this.props.permission.inGroup()) ||
        (this.props.mode == 'add' && LoginStore.getUser()) ?
        false : true;
    }

    return (
      <div className='center-block button-bar'>
        <button className='btn btn-info' disabled={editDisabled} onClick={onAddOrEdit}>
          {addOrEditText}
        </button>
        {this.getDeleteGroupButton()}
        <button className='btn btn-info' onClick={this.cancel.bind(this)}>
          Cancel
        </button>
      </div>
    );
  }
}
