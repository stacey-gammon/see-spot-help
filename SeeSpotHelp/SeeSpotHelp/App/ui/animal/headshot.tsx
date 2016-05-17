import * as React from 'react';

import PhotoUpload from '../shared/photoupload';

export default class HeadShot extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PhotoUpload
        headShot="true"
        group={this.props.group}
        permission={this.props.permission}
        animal={this.props.animal}>
        <img className="media-object" src={this.props.src} />
      </PhotoUpload>
    );
  }
}
