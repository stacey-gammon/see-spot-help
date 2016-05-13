'use strict';

import * as React from 'react';
import Utils from '../uiutils';

export default class Page extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='page'>
        {this.props.children}
      </div>
    );
  }
}
