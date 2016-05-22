import * as React from 'react';

import PhotoStore from '../../stores/photostore';
import HeadShot from '../shared/headshot';

export default class AnimalHeadShot extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    var editable = this.props.permission.inGroup();
    return (
      <HeadShot editable={editable}
                photoId={this.props.animal.photoId}
                permission={this.props.permission}
                animal={this.props.animal}
                group={this.props.group}/>
    );
  }
}
