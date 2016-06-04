var rules = {
  ".read": "auth != null",

  "emails": {
    ".read" : true,
    ".write": true
  },

  "inviteCodes": {
    ".read": "true",
    ".write": "true"
  },

  "users": {
    "$userId": {
      ".read": "true",
      ".write": "true"
    }
  }
};

var TopLevelTables = [
  'Activity',
  'Animal',
  'Group',
  'Permission',
  'Photo',
  'Schedule'
];

function InitializeRulesToAllOpen() {
  for (var i = 0; i < TopLevelTables.length; i++) {
    var table = TopLevelTables[i];
    rules[table] = {};
    rules[table][table] = {
      ".read": "true",
      ".write": "true"
    };
    rules[table][table + 'ByAnimalId'] = {
      ".read": "true",
      ".write": "true"
    };
    rules[table][table + 'ByGroupId'] = {
      ".read": "true",
      ".write": "true"
    };
    rules[table][table + 'ByUserId'] = {
      ".read": "true",
      ".write": "true"
    };
  }
}

var PermissionsEnum = {
  MEMBER: 0,
  NONMEMBER: 1,
  ADMIN: 2,
  PENDINGMEMBERSHIP: 3,
  MEMBERSHIPDENIED: 4
}

// Shorthand
var PENDING = PermissionsEnum.PENDINGMEMBERSHIP;
var NONMEMBER = PermissionsEnum.NONMEMBER;
var MEMBER = PermissionsEnum.MEMBER;
var ADMIN = PermissionsEnum.ADMIN;
var DENIED = PermissionsEnum.MEMBERSHIPDENIED;

function addWriteRule(rules, rule) {
  rules[".write"] = rule;
}

function addReadRule(rules, rule) {
  rules[".read"] = rule;
}

function authId() {
  return "auth.uid";
}

function getPathForTable(tableName) {
  return `${tableName}/${tableName}/`;
}

function getByGroupIdPath(tableName) {
  return `${tableName}/${tableName}ByGroupId/`;
}

function getByUserIdPath(tableName) {
  return `${tableName}/${tableName}ByUserId/`;
}

function userPermissionByGroupId() {
  return `'Permission/PermissionByGroupId/' + $groupId + '/' + auth.uid + '/permission'`;
}

function userPermissionByUserId() {
  return `'Permission/PermissionByUserId/' + auth.uid + '/' + $groupId + '/permission'`;
}

function ensureNotAMemberPermissionRule() {
  var permissionId = `root.child('Permission/PermissionByGroupId/' + $groupId + '/id').val()`;
  var noDataInPermissionTable =
    `!root.child('Permission/Permission/' + ${permissionId}).exists()`;
  var noDataInPermissionByGroupIdTable = `!root.child(${userPermissionByGroupId()}).exists()`;
  var noDataInPermissionByUserIdTable = `!root.child(${userPermissionByUserId()}).exists()`;
  return `(${noDataInPermissionTable} && ${noDataInPermissionByUserIdTable} && ${noDataInPermissionByGroupIdTable})`;
}

function generatePermissionRules() {
  var groupPermissionRules = {};
  addReadRule(groupPermissionRules, 'auth != null');

  var isAuthRule = '$userId == auth.uid';

  // New members can apply for membership.
  var newMemberRequestRule =
    `(!data.exists() && ${isAuthRule} && newData.child('permission').val() == ${PENDING})`;
  var existingMemberLeaveRule =
    `(data.exists() && ${isAuthRule} && (newData.child('permission').val() == ${NONMEMBER} || !newData.exists()))`;
  var adminRule = `(root.child(${userPermissionByGroupId()}).val() == ${ADMIN})`;

  addWriteRule(groupPermissionRules,
    `${newMemberRequestRule} || ${existingMemberLeaveRule} || ${adminRule}`);

  rules["Permission"].PermissionByGroupId = {
    "$groupId": {
      "$userId": groupPermissionRules
    }
  };
  //
  // rules["Permission"].PermissionByUserId = {
  //   "$userId": {
  //     "$groupId": groupPermissionRules
  //   }
  // };

  // Rules directly on the Permission table, keyed by permission id, are different because we
  // don't have $groupId and $userId

  newMemberRequestRule =
    `(!data.exists() && newData.child('userId').val() == auth.uid && newData.child('permission').val() == ${PENDING})`;
  existingMemberLeaveRule =
    `(data.exists() && newData.child('userId').val() == auth.uid && (newData.child('permission').val() == ${NONMEMBER} || !newData.exists()))`;
  adminRule =
    `(root.child('Permission/PermissionByUserId/' + auth.uid + '/' + newData.child('groupId').val() + '/permission').val() == ${ADMIN})`;

  var permissionIdRules = {};
  addReadRule(permissionIdRules, 'auth != null');
  addWriteRule(permissionIdRules,
    `${newMemberRequestRule} || ${existingMemberLeaveRule} || ${adminRule}`);
  // rules["Permission"].Permission = {
  //   "$permissionId": permissionIdRules
  // };
}

function newRoot() {
  return `newData.parent().parent().parent()`;
}

function generateGroupRules() {
  var groupRules = {};
  var ruleId = '$groupId';
  addReadRule(groupRules, 'auth != null');

  // Allowed:
  // 1. Admins for existing groups can update.
  var existingGroupRule =
    `data.exists() && root.child(${userPermissionByGroupId()}).val() == ${ADMIN}`;

  // 2. New groups created by a new admin.
  var newGroupRule =
    `!data.exists() && ${newRoot()}.child(${userPermissionByUserId()}).val() == ${ADMIN}`;

  var writeRule = `(${existingGroupRule}) || (${newGroupRule})`;
  addWriteRule(groupRules, writeRule);
  rules['Group'] = {
    'Group': {
      '$groupId': groupRules
    }
  }
}

function generateUserRules() {
  var userRules = {};
  var userId = "$userId";
  addReadRule(userRules, "auth != null");
  addWriteRule(userRules, `(${userId} == ${authId()})`);
  rules["users"] = {
      '$userId': userRules
    };
}

function generateRules () {
  InitializeRulesToAllOpen();
  generateUserRules();
  generateGroupRules();
  generatePermissionRules();
  var superRules = {
    "rules": rules
  };
  var rulesStr = JSON.stringify(superRules, null, 2);
  $('#rulesOutput').html(rulesStr);
  return rulesStr;
}

$( document ).ready(function() {
    generateRules();
});
