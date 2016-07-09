
import Group from '../core/databaseobjects/group';
import Animal from '../core/databaseobjects/animal';
import Activity from '../core/databaseobjects/activity';
import Comment from '../core/databaseobjects/comment';

import LoginStore from '../stores/loginstore';

export default class TestData {
  public static TestAdminEmail = 'admin@test-account.com';
  public static TestAdminPassword = 'test1234';

  public static TestMemberEmail = 'member@test-account.com';
  public static TestMemberPassword = 'test1234';

  public static TestNonMemberEmail = 'nonmember@test-account.com';
  public static TestNonMemberPassword = 'test1234';

  public static testGroupId: string;
  public static testAnimalId: string;
  public static testActivityId: string;
  public static testAdminCommentId: string;
  public static testMemberCommentId: string;

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

  public static InsertTestAnimal(groupId) : Promise<any> {
    let me = this;
    let animal = TestData.GetTestAnimal(groupId);
    return animal.insert().then(function () {
      me.testAnimalId = animal.id;
      return animal;
    });
  }

  public static GetTestActivity(groupId, animalId) {
    let activity = new Activity();
    activity.animalId = animalId;
    activity.groupId = groupId;
    activity.userId = LoginStore.getUser().id;
    activity.description = 'test activity';
    return activity;
  }

  public static GetTestComment(groupId, activityId) {
    let comment = new Comment();
    comment.groupId = groupId;
    comment.userId = LoginStore.getUser().id;
    comment.comment = 'test comment';
    return comment;
  }
}
