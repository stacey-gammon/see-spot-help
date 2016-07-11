
import Group from '../core/databaseobjects/group';
import Animal from '../core/databaseobjects/animal';
import Activity from '../core/databaseobjects/activity';
import Comment from '../core/databaseobjects/comment';

import LoginStore from '../stores/loginstore';

export default class TestData {
  public static TestAdminEmail = 'test@test-account.com';
  public static TestAdminPassword = 'test1234';
  public static TestAdminId;

  public static TestMemberEmail = 'test2@test-account.com';
  public static TestMemberPassword = 'test1234';
  public static TestMemberId;

  public static TestNonMemberEmail = 'nonmember@test-account.com';
  public static TestNonMemberPassword = 'test1234';
  public static TestNonMemberId;

  public static TestGroup: Group;
  public static TestAnimal: Animal;
  public static TestActivity: Activity;
  public static TestAdminComment: Comment;
  public static TestMemberComment: Comment;

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

  public static InsertTestGroup() : Promise<any> {
    console.log('Inserting Test Group');
    let me = this;
    let group = TestData.GetTestGroup();
    return group.insert().then(function () {
      me.testGroupId = group.id;
      me.TestGroup = group;
      return group;
    });
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
    console.log('InsertTestAnimal');
    let me = this;
    let animal = TestData.GetTestAnimal(groupId);
    return animal.insert().then(function () {
      me.testAnimalId = animal.id;
      me.TestAnimal = animal;
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

  public static InsertTestActivity(groupId, animalId) : Promise<any> {
    console.log('InsertTestActivity');
    let me = this;
    let activity = TestData.GetTestActivity(groupId, animalId);
    return activity.insert().then(function () {
      me.testActivityId = activity.id;
      me.TestActivity = activity;
      return activity;
    });
  }

  public static GetTestComment(groupId, activityId) {
    let comment = new Comment();
    comment.groupId = groupId;
    comment.userId = LoginStore.getUser().id;
    comment.comment = 'test comment';
    return comment;
  }

  // Note: Must already be logged in as admin for this to work.
  public static InsertAdminComment(groupId, activityId) : Promise<any> {
    console.log('InsertAdminComment');
    let me = this;
    let comment = TestData.GetTestComment(groupId, activityId);
    return comment.insert().then(function () {
      me.testAdminCommentId = comment.id;
      me.TestAdminComment = comment;
      return comment;
    }, function(error) {
      console.log('InsertAdminComment Error:', error);
      return error;
    });
  }

  // Note: Must already be logged in as member for this to work.
  public static InsertMemberComment(groupId, activityId) : Promise<any> {
    console.log('InsertMemberComment');
    let me = this;
    let comment = TestData.GetTestComment(groupId, activityId);
    return comment.insert().then(() => {
      me.testMemberCommentId = comment.id;
      me.TestMemberComment = comment;
      return comment;
    }, function(error) {
      console.log('InsertMemberComment Error:', error);
      return error;
    });
  }
}
