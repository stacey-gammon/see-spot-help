var rules = {
  ".read": "auth != null",

  "emails": {
    ".read" : "true",
    ".write": "true"
  },

  "inviteCodes": {
    ".read": "true",
    ".write": "true"
  },

  "test": {
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
  'Comment',
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
    rules[table][table + 'ByActivityId'] = {
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

function addIndexOn(rules, index) {
  rules[".indexOn"] = index;
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

function getAllowAccessRule(permission) {
  var allowAccessExistingData =
    `(data.exists() && (root.child('Permission/PermissionByUserId/' + auth.uid + '/' + data.child('groupId').val() + '/permission').val() == ${permission}))`;
  var allowAccessNewData =
    `(newData.exists() && (root.child('Permission/PermissionByUserId/' + auth.uid + '/' + newData.child('groupId').val() + '/permission').val() == ${permission}))`;
  return `(${allowAccessExistingData} || ${allowAccessNewData})`;
}

function generateAnimalRules() {
  var animalRules = {};
  addReadRule(animalRules, "auth != null");

  var membersCanWriteRule = `${getAllowAccessRule(MEMBER)} || ${getAllowAccessRule(ADMIN)}`;
  addWriteRule(animalRules, membersCanWriteRule);
  addIndexOn(animalRules, "timestamp");

  rules["Animal"].AnimalByGroupId = {
    "$groupId": {
      "$userId": animalRules,
      ".indexOn": "timestamp"
    }
  };
  rules["Animal"].AnimalByUserId = {
    "$userId": {
      "$groupId": animalRules,
      ".indexOn": "timestamp"
    }
  };
  rules["Animal"].Animal = {
    "$animalId": animalRules,
    ".indexOn": "timestamp"
  };
}

function generateBasicTableRules(table) {
  var tableRules = {};
  addReadRule(tableRules, 'auth != null');

  var adminsCanWriteRule = getAllowAccessRule(ADMIN);
  var membersCanUpdateTheirOwn = `(data.exists() && data.child('userId').val() == auth.uid && ${getAllowAccessRule(MEMBER)})`;
  var membersCanAddTheirOwn = `(!data.exists() && newData.exists() && newData.child('userId').val() == auth.uid && ${getAllowAccessRule(MEMBER)})`;

  var writeRules = '';
  if (table == 'Photo') {
    // This is really for headshot photos only, where there is no group id.
    var nonMembersCanUpdateTheirOwn = `(data.exists() && data.child('userId').val() == auth.uid && (!data.child('groupId').exists() || data.child('groupId').val() == null))`;
    var nonMembersCanAddTheirOwn = `(newData.exists() && newData.child('userId').val() == auth.uid && (!newData.child('groupId').exists() || newData.child('groupId').val() == null))`;

    writeRules += `${nonMembersCanUpdateTheirOwn} || ${nonMembersCanAddTheirOwn} || `;
  }

  writeRules += `${adminsCanWriteRule} || ${membersCanAddTheirOwn} || ${membersCanUpdateTheirOwn}`;

  addWriteRule(tableRules, writeRules);
  addIndexOn(tableRules, "timestamp");

  rules[table][table] = {
    "$tableId": tableRules,
    ".indexOn": "timestamp"
  }
  rules[table][table + 'ByGroupId'] = {
    "$groupId": {
      "$tableId": tableRules,
      ".indexOn": "timestamp"
    }
  }
  rules[table][table + 'ByAnimalId'] = {
    "$groupId": {
      "$tableId": tableRules,
      ".indexOn": "timestamp"
    }
  }
  rules[table][table + 'ByActivityId'] = {
    "$groupId": {
      "$tableId": tableRules,
      ".indexOn": "timestamp"
    }
  }
  rules[table][table + 'ByUserId'] = {
    "$userId": {
      "$tableId": tableRules,
      ".indexOn": "timestamp"
    }
  }
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

  var existingAdminRule = `(root.child(${userPermissionByGroupId()}).val() == ${ADMIN})`;
  var newAdminRule =
      `!data.exists() && ${newRoot()}.parent().child(${userPermissionByUserId()}).val() == ${ADMIN}`;

  addWriteRule(groupPermissionRules,
      `${newMemberRequestRule} || ${existingMemberLeaveRule} || ${existingAdminRule} || ${newAdminRule}`);
  addIndexOn(groupPermissionRules, "timestamp");

  rules["Permission"].PermissionByGroupId = {
    "$groupId": {
      "$userId": groupPermissionRules,
      ".indexOn": "timestamp"
    }
  };

  rules["Permission"].PermissionByUserId = {
    "$userId": {
      "$groupId": groupPermissionRules,
      ".indexOn": "timestamp"
    }
  };

  // Rules directly on the Permission table, keyed by permission id, are different because we
  // don't have $groupId and $userId

  newMemberRequestRule =
    `(!data.exists() && newData.child('userId').val() == auth.uid && newData.child('permission').val() == ${PENDING})`;
  existingMemberLeaveRule =
    `(data.exists() && data.child('userId').val() == auth.uid && (newData.child('permission').val() == ${NONMEMBER} || !newData.exists()))`;
  existingAdminRule =
    `(data.exists() && root.child('Permission/PermissionByUserId/' + auth.uid + '/' + data.child('groupId').val() + '/permission').val() == ${ADMIN})`;
  newAdminRule =
    `(newData.exists() && ${newRoot()}.child('Permission/PermissionByUserId/' + auth.uid + '/' + newData.child('groupId').val() + '/permission').val() == ${ADMIN})`;

  var permissionIdRules = {};
  addReadRule(permissionIdRules, 'auth != null');
  addWriteRule(permissionIdRules,
      `${newMemberRequestRule} || ${existingMemberLeaveRule} || ${newAdminRule} || ${existingAdminRule}`);
  rules["Permission"].Permission = {
    "$permissionId": permissionIdRules
  };
}

function newRoot() {
  return `newData.parent().parent().parent()`;
}

function generateGroupRules() {
  var groupRules = {};
  var ruleId = '$groupId';
  addReadRule(groupRules, 'auth != null');

  // Allowed:
  // 1. Admins for existing groups can update or delete.
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
  addIndexOn(userRules, "timestamp");
  rules["users"] = {
      '$userId': userRules
    };
}

function generateRules () {
  InitializeRulesToAllOpen();
  generateUserRules();
  generateGroupRules();
  generatePermissionRules();
  generateAnimalRules();
  generateBasicTableRules('Photo');
  generateBasicTableRules('Activity');
  generateBasicTableRules('Schedule');
  generateBasicTableRules('Comment');

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
