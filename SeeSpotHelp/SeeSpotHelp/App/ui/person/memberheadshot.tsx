import * as React from 'react';

import LoginStore from '../../stores/loginstore';
import PhotoStore from '../../stores/photostore';
import HeadShot from '../shared/headshot';

export default class MemberHeadShot extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      fbProfilePhotoUrl: null
    }
    if (this.props.user && !this.props.user.photoId) {
      this.loadFacebookPhoto();
    }
  }

  loadFacebookPhoto() {
    if (!LoginStore.fbLoaded) return;
    FB.api(
       '/' + this.props.user.id.substring(9) + '/picture?width=80&height=80',
       'get',
       function (response) {
         if (response && !response.error) {
           this.setState({fbProfilePhotoUrl: response.data.url});
         }
       }.bind(this)
   );
  }

  render() {
    return (
      <HeadShot editable={this.props.editable}
                src={this.state.fbProfilePhotoUrl}
                photoId={this.props.user.photoId}
                permission={this.props.permission}
                user={this.props.user}/>
    );
  }
}
