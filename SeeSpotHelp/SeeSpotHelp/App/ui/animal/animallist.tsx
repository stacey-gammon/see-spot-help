'use strict'

import * as React from 'react';
var Loader = require('react-loader');

import AnimalListItem from './animallistitem';
import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';

export default class AnimalList extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  generateAnimal(animal) {
    return (
      <AnimalListItem
        key={animal.id}
        animal={animal}
        user={this.props.user}
        group={this.props.group }/>
    );
  }

  componentDidMount() {
    if (this.props.group) {
      AnimalStore.addPropertyListener(
        this, 'groupId', this.props.group.id, this.onChange.bind(this));
    }
  }

  componentWillUnmount() {
    AnimalStore.removePropertyListener(this);
  }

  onChange() {
    this.forceUpdate();
  }

  render() {
    var animals = AnimalStore.getAnimalsByGroupId(this.props.group.id);
    var loading = AnimalStore.areItemsDownloading('groupId', this.props.group.id);

    var animalsUiElements = [];
    if (!loading) {
      for (var i = 0; i < animals.length; i++) {
        animalsUiElements.push(this.generateAnimal(animals[i]));
      }
    }

    return (
      <Loader loaded={!loading} color="rgba(0,0,0,0.2)">
        {animalsUiElements}
      </Loader>
    );
  }
}
