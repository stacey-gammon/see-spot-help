
import Permission from '../core/databaseobjects/permission';
import LoginStore from './loginstore';
import GroupStore from './groupstore';
import PermissionsStore from './permissionsstore';

class StoreStateHelper {
  constructor() {}

  public static GetPermission(state) {
    if (!state) {
      console.log('WARN: No state to generate permission with');
      return Permission.CreateNonMemberPermission();
    }
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

  public static AddPropertyListeners(idToStoreMap, reactClass) {
    LoginStore.addChangeListener(reactClass.onChange.bind(reactClass));
    PermissionsStore.addPropertyListener(
      reactClass, 'userId', LoginStore.getUser().id, reactClass.onChange.bind(reactClass));
    for (var id in idToStoreMap) {
      var store = idToStoreMap[id];
      store.addPropertyListener(reactClass, 'id', id, reactClass.onChange.bind(reactClass));
    }
  }

  public static EnsureRequiredState(idToStoreMap, reactClass) {
    var promises = [];
    for (var id in idToStoreMap) {
      var store = idToStoreMap[id];
      promises.push(store.ensureItemById(id));
    }

    Promise.all(promises).then(
      function () {
        var permission = StoreStateHelper.GetPermission(reactClass.state);
        reactClass.setState({ permission: permission });
        this.AddPropertyListeners(idToStoreMap, reactClass);
      }.bind(this)
    );
  }
}

export default StoreStateHelper;
