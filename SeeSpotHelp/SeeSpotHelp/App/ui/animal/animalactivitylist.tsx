'use strict'

import * as React from 'react';

import AnimalActivityStore from '../../stores/animalactivitystore';
import VolunteerStore from '../../stores/volunteerstore';

import ActivityElement from '../shared/activityelement';

export default class AnimalActivityList extends React.Component<any, any> {
  public mounted: boolean = false;

  constructor(props) {
    super(props);
    this.state = {
      activities: AnimalActivityStore.getActivityByAnimalId(this.props.animal.id)
    }
  }

  componentDidMount() {
    this.mounted = true;
    AnimalActivityStore.addPropertyListener(
      this, 'animalId', this.props.animal.id, this.onChange.bind(this));
  }

  onChange() {
    if (this.mounted) {
      var activities = AnimalActivityStore.getActivityByAnimalId(this.props.animal.id);
      this.setState({ activities: activities });
    }
  }

  componentWillUnmount() {
    AnimalActivityStore.removePropertyListener(this);
    this.mounted = false;
  }

  generateAnimalNote(note) {
    return (
      <ActivityElement key={note.id}
                activity={note}
                view={'animal'}
                permission={this.props.permission}
                group={this.props.group}
                animal={this.props.animal}/>
    );
  }

  render() {
    var activityElements = this.state.activities.map(this.generateAnimalNote.bind(this));

    var text =
      this.state.activities.length > 0 ? '' : 'Be the first to make a post!';
    if (AnimalActivityStore.areItemsDownloading('animalId', this.props.animal.id)) {
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
