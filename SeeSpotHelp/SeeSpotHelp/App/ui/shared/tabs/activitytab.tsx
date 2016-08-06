'use strict'

import * as React from 'react';
import ActivityStore from '../../../stores/activitystore';
import VolunteerStore from '../../../stores/volunteerstore';
import Permission from '../../../core/databaseobjects/permission';

import ActivityElement from '../activity/activityelement';

var Loader = require('react-loader');

interface propTypes {
  permission: Permission,
  property: string,
  value: string
}

export default class ActivityTab extends React.Component<propTypes, any> {
  private batchSize: number = 10;

  constructor(props) {
    super(props);
    this.state = {
        activities: [],
        listLength: 0,
        loaded: false
    }
  }

  componentWillMount() {
    ActivityStore.addPropertyListener(
        this, this.props.property, this.props.value, this.onChange.bind(this));
    this.loadMore();
  }

  onChange() {
    ActivityStore.ensureItemsByProperty(this.props.property,
                                        this.props.value,
                                        this.state.listLength)
        .then((activities) => {
          this.setState({
              activities: activities,
              loaded: true
            });
        });
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
      <ActivityElement key={note.id}
                       view={view}
                       activity={note}
                       permission={this.props.permission}/>
    );
  }

  getNoActivityDisplay() {
    if (this.state.loaded && this.state.activities.length == 0) {
      return <div className='no-activity-display'>No Activity to Report</div>
    } else {
      return null;
    }
  }

  areItemsDownloading() {
    return ActivityStore.areItemsDownloading(this.props.property, this.props.value);
  }

  noMore() {
    let lessThanRequested = !this.areItemsDownloading() &&
                            this.state.activities.length < this.state.listLength;
    let containsLastItemAvailable =
        ActivityStore.getOldestItemId(this.props.property, this.props.value) &&
        this.state.activities.length &&
        ActivityStore.getOldestItemId(this.props.property, this.props.value) ==
            this.state.activities[this.state.activities.length - 1].id;
    return lessThanRequested || containsLastItemAvailable;
  }

  hasMoreItems() {
    return !this.noMore();
  }

  loadMore() {
    let newListLength = this.state.listLength + this.batchSize;
    let activities = ActivityStore.getItemsByProperty(this.props.property,
                                                      this.props.value,
                                                      newListLength);
    this.setState({activities: activities,
                   loaded: !this.areItemsDownloading(),
                   listLength: newListLength});
  }

  loadMoreButton() {
    if (this.areItemsDownloading()) {
      return <Loader loaded='false' />
    }

    if (this.hasMoreItems()) {
      return <button className='btn btn-info' onClick={this.loadMore.bind(this)}>
               Load More
             </button>
    }

    return null;
  }

  render() {
    var activityElements = this.state.activities.map(this.generateAnimalNote.bind(this));

    return (
      <div className="list-group">
          {this.getNoActivityDisplay()}
          {activityElements}
          {this.loadMoreButton()}
      </div>
    );
  }
}
