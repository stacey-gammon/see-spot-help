'use strict';

import * as React from 'react';

export default class InfoBar extends React.Component<any, any> {
  public context: any;
  constructor(props) {
    super(props);
  }
  // Required for page transitions via this.context.router.push.
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  goBackToShelter() {
   this.context.router.goBack();
  }

  getTitle() {
    if (this.props.title) {
      return <h1>{this.props.title}</h1>;
    } else {
      return null;
    }
  }

  getBackButton() {
    // TODO: only show on member and animal home pages...
    return <a className='info-bar-back' onClick={this.goBackToShelter.bind(this)}>back</a>;
  }

  render() {
    var mediaLeft = "";
    var mediaCenter = "";
    var mediaRight = "";
    if (!Array.isArray(this.props.children)) {
      mediaCenter = this.props.children;
    } else if (this.props.children.length >= 2) {
      mediaLeft = this.props.children[0];
      mediaCenter = this.props.children[1];
    }
    if (this.props.children.length == 3) {
      mediaRight = this.props.children[2];
    }

    var additionalChildren = [];
    for (var i = 3; i < this.props.children.length; i++) {
      additionalChildren.push(this.props.children[i]);
    }

    var className = this.props.noTabs ? 'info-top-no-tabs' : 'info-top';
    className += ' ' + this.props.className;

    return (
      <div className={className}>
        {this.getBackButton()}
        <a href="#groupHomePage">{this.getTitle()}</a>
        <div className='media'>
          <div className='media-left'>
            {mediaLeft}
          </div>
          <div className='media-body'>
            {mediaCenter}
          </div>
          <div className='media-right'>
            {mediaRight}
          </div>
        </div>
        {additionalChildren}
      </div>
    );
  }
}
