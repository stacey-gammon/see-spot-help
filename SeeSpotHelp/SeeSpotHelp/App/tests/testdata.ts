
import Group from '../core/databaseobjects/group';
import Animal from '../core/databaseobjects/animal';
import Activity from '../core/databaseobjects/activity';

import LoginStore from '../stores/loginstore';

export default class TestData {
  public static GetTestGroup() {
    let group = new Group();
    group.name = 'Test Group 1234';
    group.shelter = 'Test Shelter';
    group.address = '123 lane';
    group.city = 'the city';
    group.state = 'New York';
    group.zipCode = '12345';
    return group;
  }

  public static GetTestAnimal(groupId) {
    let animal = new Animal();
    animal.name = 'doggie';
    animal.type = 'dog';
    animal.age = '1';
    animal.breed = 'pit';
    animal.groupId = groupId;
    animal.userId = LoginStore.getUser().id;
    return animal;
  }

  public static GetTestActivity(groupId, animalId) {
    let activity = new Activity();
    activity.animalId = animalId;
    activity.groupId = groupId;
    activity.userId = LoginStore.getUser().id;
    activity.description = 'test activity';
    return activity;
  }
}
