
import Permission from '../core/databaseobjects/permission';
import LoginStore from './loginstore';
import GroupStore from './groupstore';
import PermissionsStore from './permissionsstore';

class StoreStateHelper {
	constructor() {}

	public static GetPermission(state) {
		var groupId = null;
		if (state.groupId) {
			groupId = state.groupId;
		} else if (state.group) {
			groupId = state.group.id;
		}

		return LoginStore.getUser() && groupId ?
			PermissionsStore.getPermission(LoginStore.getUser().id, groupId) :
			Permission.CreateNonMemberPermission();
	}

	public static AddChangeListeners(stores, reactClass) {
		for (var i = 0; i < stores.length; i++) {
			stores[i].addChangeListener(reactClass.onChange);
		}
	}
	public static RemoveChangeListeners(stores, reactClass) {
		for (var i = 0; i < stores.length; i++) {
			stores[i].removeChangeListener(reactClass.onChange);
		}
	}
}

export default StoreStateHelper;
