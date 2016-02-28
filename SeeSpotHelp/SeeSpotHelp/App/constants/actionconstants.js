"use strict"

var ActionConstants = Object.freeze(
    {
        LOGIN_USER_SUCCESS: 0,
        LOGOUT_USER: 1,
        LOGIN_USER_ERROR: 2,
        NEW_GROUP_ADDED: 3,
        ANIMAL_UPDATED: 4,
        NEW_ANIMAL_ADDED: 5,
        MEMBER_DOWNLOADED: 6,
        GROUP_DELETED: 7
    }
);

module.exports = ActionConstants;
