'use strict'

import * as React from 'react';
import ActivityStore from '../../../stores/animalactivitystore';
import VolunteerStore from '../../../stores/volunteerstore';

import ActivityElement from '../activity/activityelement';

var Loader = require('react-loader');
var Infinite = require('react-infinite');

export default class ActivityTab extends React.Component<any, any> {
  private infiniteLoadBatch: number = 3;

  constructor(props) {
    super(props);
    this.state = {
        activities: [],
        isInfiniteLoading: false,
        listLength: 3,
        infiniteLoadBeginEdgeOffset: 50
    }
  }

  componentDidMount() {
    ActivityStore.addPropertyListener(
      this, this.props.property, this.props.value, this.onChange.bind(this));
  }

  handleInfiniteLoad() {
    console.log('handleInfiniteLoad');
    if (ActivityStore.getOldestItemId(this.props.property, this.props.value) &&
        this.state.activites.length &&
        ActivityStore.getOldestItemId(this.props.property, this.props.value) ==
            this.state.activites[this.state.activites.length - 1].id) {
      this.setState({infiniteLoadBeginEdgeOffset: undefined});
      return;
    }

    let newListLength = this.state.listLength + this.infiniteLoadBatch;
    let activities = ActivityStore.getItemsByProperty(this.props.property, this.props.value, newListLength);
    this.setState(
        {
          isInfiniteLoading: ActivityStore.areItemsDownloading(this.props.property, this.props.value),
          elementCountToShow: newListLength,
          activities: activities,
          listLength: newListLength
        });
  }

  elementInfiniteLoad() {
    return <Loader loaded={!this.state.isInfiniteLoading} />
  }

  onChange() {
    var activities = ActivityStore.getItemsByProperty(this.props.property,
                                                      this.props.value,
                                                      this.state.listLength);
    this.setState(
      {
        activities: activities,
        isInfiniteLoading: ActivityStore.areItemsDownloading(this.props.property, this.props.value)
      }
    );
  }

  componentWillUnmount() {
    ActivityStore.removePropertyListener(this);
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

    return (
      <div className="list-group">
        {this.getNoActivityDisplay()}
        <Infinite elementHeight={120}
                  infiniteLoadBeginEdgeOffset={this.state.infiniteLoadBeginEdgeOffset}
                  containerHeight={500}
                  useWindowAsScrollContainer={false}
                  onInfiniteLoad={this.handleInfiniteLoad.bind(this)}
                  loadingSpinnerDelegate={this.elementInfiniteLoad()}
                  isInfiniteLoading={this.state.isInfiniteLoading}>
          {activityElements}
        </Infinite>
      </div>
    );
  }
}
