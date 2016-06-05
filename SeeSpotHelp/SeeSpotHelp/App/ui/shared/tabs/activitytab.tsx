'use strict'

import * as React from 'react';
import AnimalActivityStore from '../../../stores/animalactivitystore';
import VolunteerStore from '../../../stores/volunteerstore';

import ActivityElement from '../activityelement';

var Loader = require('react-loader');

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
    var view = 'user';
    if (this.props.property == 'groupId') {
      view = 'group'
    } else if (this.props.property == 'animalId') {
      view = 'animal';
    }
    return (
      <ActivityElement key={note.id} view={view} activity={note} permission={this.props.permission}/>
    );
  }

  getNoActivityDisplay() {
    if (this.state.activities.length == 0) {
      return <div className='no-activity-display'>No Activity to Report</div>
    } else {
      return null;
    }
  }

  render() {
    var activityElements = this.state.activities.map(this.generateAnimalNote.bind(this));
    var loaded = true;
    if (AnimalActivityStore.areItemsDownloading(this.props.property, this.props.value)) {
      loaded = false;
    }

    return (
      <div className="list-group">
        <Loader loaded={loaded}>
        {this.getNoActivityDisplay()}
        {activityElements}
        </Loader>
      </div>
    );
  }
}
