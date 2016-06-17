
import DatabaseObject from './databaseobject';

export default class Schedule extends DatabaseObject {
  public start: string = '';
  public end: string = '';
  public title: string = '';
  public allDay: boolean = false;
  public description: string = '';
  public userId: string = '';
  public animalId: string = '';
  public groupId: string = '';

  constructor() {
    super();

    this.mappingProperties.push('userId');
    this.mappingProperties.push('groupId');
    this.mappingProperties.push('animalId');
  }

  createInstance(): Schedule { return new Schedule(); }

  updateFromInputFields(inputFields) {
    super.updateFromInputFields(inputFields);
    var inputEndField = inputFields['endTime'];
    var inputStartField = inputFields['startTime'];
    var start = moment(inputFields['date'].value);
    if (inputStartField.value && inputEndField.value) {
      this.start = start.format('MM-DD-YYYY') + ' ' + inputStartField.value;
      this.end = start.format('MM-DD-YYYY') + ' ' + inputEndField.value;
    } else {
      this.start = start.format('MM-DD-YYYY');
    }
  }
}
