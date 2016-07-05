"use strict";

import * as React from 'react';
var Router = require("react-router");
var Loader = require('react-loader');

import moment = require('moment');

import EditorElement from './shared/editor/editorelement';

import Utils from './uiutils';
import LoginStore from '../stores/loginstore';
import GroupStore from '../stores/groupstore';
import ScheduleStore from '../stores/schedulestore';
import VolunteerStore from '../stores/volunteerstore';
import AnimalStore from '../stores/animalstore';
import PermissionsStore from '../stores/permissionsstore';
import Schedule from '../core/databaseobjects/schedule';
import Volunteer from '../core/databaseobjects/volunteer';
import Permission from '../core/databaseobjects/permission';
import ScheduleEditor from '../core/editor/scheduleeditor';

import StoreStateHelper from '../stores/storestatehelper';

export default class AddCalendarEvent extends React.Component<any, any> {
  public refs: any;
  public context: any;
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);

    this.ensureRequiredState = this.ensureRequiredState.bind(this);

    var startDate = Utils.FindPassedInProperty(this, 'startDate');
    var group = Utils.FindPassedInProperty(this, 'group');
    var animalId = Utils.FindPassedInProperty(this, 'animalId');
    var scheduleId = Utils.FindPassedInProperty(this, 'scheduleId');
    var schedule = null;
    if (scheduleId) {
      schedule = ScheduleStore.getScheduleById(scheduleId);
    }
    var mode = Utils.FindPassedInProperty(this, 'mode');
    var startTime = Utils.FindPassedInProperty(this, 'startTime');
    var endTime = Utils.FindPassedInProperty(this, 'endTime');
    var allowAnimalChange = Utils.FindPassedInProperty(this, 'allowAnimalChange');
    var allowGroupChange = Utils.FindPassedInProperty(this, 'allowGroupChange');

    if (!mode) mode = 'add';

    this.state = {
      startDate: moment(startDate, 'MM-DD-YYYY'),
      group: group,
      animalId: animalId,
      schedule: schedule,
      mode: mode,
      updated: false,
      added: false,
      startTime: startTime,
      endTime: endTime
    }

    // Properties that we don't want to load from local storage, since they are true/false and we
    // have a hard time distinguishing between false and null (which we should fix).
    this.state.allowAnimalChange = allowAnimalChange;
    this.state.allowGroupChange = allowGroupChange;
    this.state.loading = false;
  }

  componentDidMount() {
    LoginStore.addChangeListener(this.ensureRequiredState);
    this.ensureRequiredState();
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.ensureRequiredState);
  }

  viewOnly() {
    return !LoginStore.getUser() ||
      (this.state.schedule && this.state.schedule.userId != LoginStore.getUser().id);
  }

  ensureRequiredState() {
    if (!LoginStore.getUser()) return;

    var editor = this.props.mode == 'add' ?
        new ScheduleEditor(null) : new ScheduleEditor(this.state.schedule);
    editor.inputFields['date'].value = this.state.startDate.format('MM-DD-YYYY');

    // A day click defaults the time to 12 am, lets reset that to a full day event.
    if (this.state.startTime == '12:00 am' && (
          this.state.startTime == this.state.endTime || this.state.endTime == 'Invalid date')) {
      this.state.startTime = this.state.endTime = '';
    }

    if (this.state.group) {
      editor.inputFields['groupId'].disabled = true;
      editor.inputFields['groupId'].value = this.state.group.id;
    }
    if (this.state.animalId) {
      editor.inputFields['animalId'].disabled = true;
      editor.inputFields['animalId'].value = this.state.animalId;
    }
    editor.inputFields['startTime'].value = this.state.startTime;
    editor.inputFields['endTime'].value = this.state.endTime;

    var permission = StoreStateHelper.GetPermission(this.state);
    if (this.state.schedule) {
      permission = this.state.schedule.userId == LoginStore.getUser().id ?
          Permission.CreateAdminPermission(this.state.schedule.userId, '') :
          Permission.CreateNonMemberPermission(this.state.schedule.userId, '');
    }
    var userId = this.state.schedule ? this.state.schedule.userId : LoginStore.getUser().id;
    VolunteerStore.ensureItemById(userId).then(function(user: Volunteer) {
      editor.inputFields['member'].value = user.name;
      this.setState({ permission: permission, editor: editor});
    }.bind(this));
  }

  goBack() {
    this.context.router.goBack();
  }

  render() {
    if (!this.state.editor) {
      return <Loader loaded={false}/>
    }
      var title = this.state.mode == 'add' ? 'Add Event' : 'Edit Event';
      if (this.viewOnly() && this.state.schedule) {
        title = 'View Event';
      }
      var extraFields = {
        animalId: this.state.animalId
      };
      return (
        <EditorElement
          extraFields={extraFields}
          title={title}
          mode={this.state.mode}
          permission={this.state.permission}
          onEditOrInsert={this.goBack.bind(this)}
          onDelete={this.goBack.bind(this)}
          editor={this.state.editor} />
      );
  }
}
