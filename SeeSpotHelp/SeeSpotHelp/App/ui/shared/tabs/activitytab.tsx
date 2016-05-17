'use strict'

import * as React from 'react';
import AnimalActivityStore from '../../../stores/animalactivitystore';
import VolunteerStore from '../../../stores/volunteerstore';

import ActivityElement from '../activityelement';

export default class ActivityTab extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activities: AnimalActivityStore.getItemsByProperty(this.props.property, this.props.value)
    }
  }

  componentDidMount() {
    AnimalActivityStore.addPropertyListener(
      this, this.props.property, this.props.value, this.onChange.bind(this));
  }

  onChange() {
    var activities = AnimalActivityStore.getItemsByProperty(this.props.property, this.props.value);
    this.setState({ activities: activities });
  }

  componentWillUnmount() {
    AnimalActivityStore.removePropertyListener(this);
  }

  generateAnimalNote(note) {
    return (
      <ActivityElement key={note.id} activity={note} permission={this.props.permission}/>
    );
  }

  render() {
    var activityElements = this.state.activities.map(this.generateAnimalNote.bind(this));

    var text;
    if (this.state.activities.length == 0) {
      if (this.props.value == 'animalId') {
        text = 'Be the first to make a post!';
      } else if (this.props.value == 'groupId') {
        text = 'This group has no activity yet.';
      } else {
        text = 'This user has no activity yet.';
      }
    }

    if (AnimalActivityStore.areItemsDownloading(this.props.property, this.props.value)) {
      text = 'Loading...';
    }

    return (
      <div className="list-group">
        {text}
        {activityElements}
      </div>
    );
  }
}
