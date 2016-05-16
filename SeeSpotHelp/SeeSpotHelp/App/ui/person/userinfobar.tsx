'use strict';

import * as React from 'react';

import InfoBar from '../shared/infobar';
import EditIcon from '../shared/editor/editicon';
import ProfilePic from './profilepic';
import LoginStore from '../../stores/loginstore';

export default class UserInfoBar extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      profileUrl: this.props.user.imgUrl
    }
  }

  getHeader() {
    var style = {textAlign: 'left !important'};
    if (this.props.user == LoginStore.getUser()) {
      return <h1 style={style}>{'Hello, ' + LoginStore.getUser().name}  {this.getEditIcon()} </h1>;
    } else {
      return <h2 style={style}>{this.props.user.getDisplayName()}</h2>;
    }
  }

  isMe() {
    return this.props.user == LoginStore.getUser();
  }

  getTitle() {
    if (this.isMe() || !this.props.group) {
      return null;
    } else {
      return this.props.group.name;
    }
  }

  getMessageLink() {
    if (this.isMe()) {
      return null;
    } else {
      var mailto = 'mailto:' + this.props.user.email;
      return <a href={mailto}>Send Message</a>
    }
  }

  getEditIcon() {
    if (!this.isMe()) {
      return null;
    } else {
      return <EditIcon editPage='editProfile' />
    }
  }

  render() {
    return (
      <div>
        <InfoBar className='group-info-bar' title={this.getTitle()}>
          <ProfilePic user={this.props.user}/>
          <div>
            {this.getHeader()}
            {this.getMessageLink()}
            <div>{this.props.user.aboutMe}</div>
          </div>
        </InfoBar>
      </div>
    );
  }
}
