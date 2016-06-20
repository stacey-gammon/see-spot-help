'use strict';

var React = require("react");

import Utils from './uiutils';
import ScheduleStore from '../stores/schedulestore';
import AnimalStore from '../stores/animalstore';
import VolunteerStore from '../stores/volunteerstore';
import LoginStore from '../stores/loginstore';
import GroupStore from '../stores/groupstore';

import moment = require('moment');

var addCalendarEvent = require("./addcalendarevent");

var Calendar = React.createClass({
  getInitialState: function() {
    var state = {
      defaultView: null
    };
    return state;
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentDidMount: function() {
    this.initializeCalendar();
  },

  componentWillUnmount: function() {
    ScheduleStore.removePropertyListener(this);
    VolunteerStore.removePropertyListener(this);
    AnimalStore.removePropertyListener(this);
    GroupStore.removePropertyListener(this);
  },

  onChange: function() {
    console.log('Calendar:onChange');
    $('#calendar').fullCalendar('removeEvents');
    var events = this.getEvents();
    console.log('adding event source with ', events);
    $('#calendar').fullCalendar('addEventSource', events);
  },

  getColorForVolunteer: function (volunteer, group) {
    if (!volunteer.color) {
      volunteer.color = group.GetColorForVolunteer();
      volunteer.update();
      group.update();
    }
    return volunteer.color;
  },

  getColorForAnimal: function (animal, group) {
    if (!animal.color) {
      animal.color = group.GetColorForAnimal();
      animal.update();
      group.update();
    }
    return animal.color;
  },

  getEvents: function() {
    var schedule;

    if (this.props.view == 'animal' && this.props.animalId) {
      ScheduleStore.addPropertyListener(this, 'animalId', this.props.animalId, this.onChange.bind(this));
      schedule = ScheduleStore.getScheduleByAnimalId(this.props.animalId);
    } else if (this.props.view == 'group' && this.props.group) {
      ScheduleStore.addPropertyListener(this, 'groupId', this.props.group.id, this.onChange.bind(this));
      schedule = ScheduleStore.getScheduleByGroup(this.props.group.id);
    } else if (this.props.view == 'member' && this.props.memberId) {
      ScheduleStore.addPropertyListener(this, 'userId', this.props.memberId, this.onChange.bind(this));
      schedule = ScheduleStore.getScheduleByMember(this.props.memberId);
    } else if (this.props.view == 'profile' && LoginStore.getUser()) {
      ScheduleStore.addPropertyListener(this, 'userId', LoginStore.getUser().id, this.onChange.bind(this));
      schedule = ScheduleStore.getScheduleByMember(LoginStore.getUser().id);
    }

    if (!schedule) return [];

    // Dynamically generate the title in case the animal's or the user's name changes.
    for (var i = 0; i < schedule.length; i++) {
      var event = schedule[i];

      var volunteer = VolunteerStore.getVolunteerById(event.userId);
      if (!volunteer) {
        VolunteerStore.addPropertyListener(this, 'id', event.userId, this.onChange.bind(this));
      }

      var animal = AnimalStore.getAnimalById(event.animalId);
      if (!animal) {
        AnimalStore.addPropertyListener(this, 'id', event.animalId, this.onChange.bind(this));
      }

      var group = GroupStore.getGroupById(event.groupId);
      if (!group) {
        GroupStore.addPropertyListener(this, 'id', event.groupId, this.onChange.bind(this));
      }

      // We'll have to wait for them to be downloaded.
      if (!volunteer || !animal || !group) return null;

      var showingGroupCalendar = this.props.animalId < 0 && this.props.memberId < 0;

      if (showingGroupCalendar) {
        event.title = animal.name;
        if (this.props.colorByAnimal) {
          event.color = this.getColorForAnimal(animal, group);
        } else {
          event.color = this.getColorForVolunteer(volunteer, group);
        }
      } else if (!this.props.animalId) {
        // We are on a member's tab, color by animal.  Colors might be the same if the user
        // belongs to more than one group.
        event.color = this.getColorForAnimal(animal, group);
        event.title = animal.name;
      } else {
        // We are showing only an animals events, color by member.
        event.color = this.getColorForVolunteer(volunteer, group);
        event.title = volunteer.getDisplayName();
      }

      event.start = moment(event.start);
      event.allDay = !event.end || event.end == event.start ? true : false;
      if (event.end) {
        event.end = moment(event.end);
      }
    }
    return schedule;
  },

  initializeCalendar: function() {
    var events = this.getEvents();
    console.log('initializeCalendar with events: ', events);
    var outer = this;
    var defaultView = this.state.defaultView ? this.state.defaultView : 'month';
    $('#calendar').fullCalendar({
      height: 'auto',
      events: events,

      defaultView: defaultView,

      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },

      eventClick: function(event) {
        if (!event) return false;
        this.context.router.push({
          pathname: "addCalendarEvent",
          state: {
            group: this.props.group,
            animalId: this.props.animalId,
            mode: 'edit',
            scheduleId: event.id,
            startDate: moment(event.start).format('MM-DD-YYYY'),
            startTime: moment(event.start).format('hh:mm a'),
            endTime: moment(event.end).format('hh:mm a')
          }
        });
      }.bind(this),

      dayClick: function(date) {
        if (this.props.view == "member") return;
        this.context.router.push({
          pathname: "addCalendarEvent",
          state: {
            mode: 'add',
            scheduleId: -1,  // Just avoid pulling schedule from local storage,
            group: this.props.group,
            animalId: this.props.animalId,
            startDate: date.format('MM-DD-YYYY'),
            startTime: date.format('hh:mm a'),
            endTime: date.format('hh:mm a')
          }
        });
      }.bind(this),

      viewRender: function(view) {
        this.setState({ defaultView: view.name });
        var stateDuplicate = this.state;
        stateDuplicate.defaultView = view.name;
        Utils.LoadOrSaveState(stateDuplicate);
      }.bind(this)
    });
  },

  componentDidUpdate: function() {
    var calendar: JQuery = $("#calendar");
    // This is a really crappy hack. Full Calendar will not render if it's not visible
    // and because of the tabs, it isn't visible at first.  There isn't any react call that
    // I can find that will be called after everything is display on a tab.
    setTimeout(function() {
      console.log('re-rendering calendar');
      calendar.fullCalendar('render');
    }.bind(this), 300);
  },

  render: function() {
    console.log('Calendar: render');
    return (
      <div className="calendar-container" ref="calendar" id="calendar"></div>
    );
  }

});

module.exports = Calendar;
