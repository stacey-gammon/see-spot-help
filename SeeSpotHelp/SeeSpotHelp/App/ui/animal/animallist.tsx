'use strict'

import * as React from 'react';
var Loader = require('react-loader');
var Infinite = require('react-infinite');

import AnimalListItem from './animallistitem';
import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';

export default class AnimalList extends React.Component<any, any> {
  private infiniteLoadBatch: number = 3;

  constructor(props) {
    super(props);
    this.state = {
      isInfiniteLoading: false,
      listLength: 3,
      animals: []
    }
  }

  generateAnimal(animal) {
    return (
      <AnimalListItem
        key={animal.id}
        animal={animal}
        permission={this.props.permission}
        user={this.props.user}
        group={this.props.group }/>
    );
  }

  componentDidMount() {
    if (this.props.group) {
      AnimalStore.addPropertyListener(
        this, 'groupId', this.props.group.id, this.onChange.bind(this));
      this.onChange();
    }
  }

  componentWillUnmount() {
    AnimalStore.removePropertyListener(this);
  }

  onChange() {
    this.setState({
      animals: AnimalStore.getItemsByProperty('groupId',
                                              this.props.group.id,
                                              this.state.listLength),
      isInfiniteLoading: AnimalStore.areItemsDownloading('groupId', this.props.group.id)
    });
  }

  elementInfiniteLoad() {
    return <Loader loaded={!this.state.isInfiniteLoading} />
  }

  handleInfiniteLoad() {
    console.log('handleInfiniteLoad');
    let newListLength = this.state.listLength + this.infiniteLoadBatch;
    console.log('handleInfiniteLoad, getting new length: ' + newListLength);
    let animals = AnimalStore.getItemsByProperty('groupId', this.props.group.id, newListLength);
    this.setState(
        {
          isInfiniteLoading: AnimalStore.areItemsDownloading('groupId', this.props.group.id),
          elementCountToShow: newListLength,
          animals: animals,
          listLength: newListLength
        });
  }

  render() {
    var animalUiElements = [];
    for (var i = 0; i < this.state.animals.length; i++) {
      animalUiElements.push(this.generateAnimal(this.state.animals[i]));
    }

    return (
      <Infinite elementHeight={120}
                infiniteLoadBeginEdgeOffset={50}
                containerHeight={600}
                useWindowAsScrollContainer={false}
                onInfiniteLoad={this.handleInfiniteLoad.bind(this)}
                loadingSpinnerDelegate={this.elementInfiniteLoad()}
                isInfiniteLoading={this.state.isInfiniteLoading}>
        {animalUiElements}
      </Infinite>
    );
  }
}
