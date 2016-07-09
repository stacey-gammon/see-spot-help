import * as React from 'react';
var Router = require('react-router');
var LinkContainer = require('react-router-bootstrap').LinkContainer;
import LoginStore from '../stores/loginstore';
import GroupListItem from './group/grouplistitem';
import Animal from '../core/databaseobjects/animal';
import Group from '../core/databaseobjects/group';

export default class ShelterSearchResults extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  generateResult(result) {
    if (this.props.searchForValue == 'groups') {
      var group = Group.castObject(result);
      if (!group.isArchived()) {
        return <GroupListItem key={result.id} group={group}/>
      } else {
        return null;
      }
    }
    return null;
  }

  render() {
    var items = [];
    for (var groupId in this.props.results) {
      items.push(this.generateResult(this.props.results[groupId]));
    }
    return (
      <div>
        {items}
      </div>
    );
  }
}
