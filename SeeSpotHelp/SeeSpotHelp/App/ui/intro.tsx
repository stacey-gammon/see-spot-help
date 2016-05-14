"use strict"

import * as React from 'react';
var LinkContainer = require('react-router-bootstrap').LinkContainer;

export default class Intro extends React.Component<any, any> {
  constructor(props) { super(props); }

  render() {
    return (
      <div className="loginPage" style={{margin: '0 auto', maxWidth: '600px'}}>
          <h1>Get started with The Shelter Helper</h1>
          <br/>
          <p style={{textAlign: 'center'}}>
            <LinkContainer to='searchpage'>
              <button className='btn btn-info btn-big'>
                Search Groups
              </button>
            </LinkContainer>
          </p>
          <p style={{textAlign: 'center'}}>
            <LinkContainer to='addNewGroup'>
              <button className='btn btn-info btn-big'>
                Start a New Group
              </button>
            </LinkContainer>
          </p>
        </div>
    );
  }
}
