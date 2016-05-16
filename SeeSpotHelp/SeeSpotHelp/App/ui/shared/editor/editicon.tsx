'use strict'

import * as React from 'react';

import LoginStore from '../../../stores/loginstore';
import Permission from '../../../core/databaseobjects/permission';

export default class EditIcon extends React.Component<any, any> {
  context = { router: null }; // Just to keep Typescript happy.
  static contextTypes = { router: React.PropTypes.object.isRequired }

  constructor(props) {
    super(props);
  }

  edit() {
    this.context.router.push(
      {
        pathname: this.props.editPage,
        state: this.props.editPageState
      });
  }

  render() {
    return (
      <span style={{marginLeft: 10 + 'px'}} onClick={this.edit.bind(this)}
        className="glyphicon glyphicon-edit">
      </span>
    );
  }
}
