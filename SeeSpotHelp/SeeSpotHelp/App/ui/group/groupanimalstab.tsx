'use strict'

import * as React from 'react';

import ActionsBar from '../shared/actionsbar';
import AnimalList from '../animal/animallist';
import AddAnimalButton from '../animal/addanimalbutton';

export default class GroupAnimalsTab extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="shelterAnimalsTab">
        <ActionsBar>
          <AddAnimalButton
            group={this.props.group}
            permission={this.props.permission}/>
        </ActionsBar>
        <AnimalList
          group={this.props.group}
          permission={this.props.permission}/>
      </div>
    );
  }
}
