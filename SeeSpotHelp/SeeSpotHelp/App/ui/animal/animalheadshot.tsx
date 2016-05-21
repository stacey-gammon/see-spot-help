import * as React from 'react';

import PhotoStore from '../../stores/photostore';
import HeadShot from '../shared/headshot';

export default class AnimalHeadShot extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    PhotoStore.addPropertyListener(
      this, 'animalId', this.props.animal.id, this.forceUpdate.bind(this));
    PhotoStore.addPropertyListener(
      this, 'id', this.props.animal.photoId, this.forceUpdate.bind(this));
  }

  componentWillUnmount() {
    PhotoStore.removePropertyListener(this);
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
