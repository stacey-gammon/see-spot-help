import DataServices from './dataservices';
import Utils from './utils';

abstract class DatabaseObject {
	public timestamp: number = Date.now();
	public id: string;
	public className: string;
	public classNameForSessionStorage;
	public firebasePath;

	// If the object wants to store duplicate entries of itself, mapped by a particular unique
	// attribute, it should add the properties in here.
	public mappingProperties: Array<string> = [];

	constructor() {
		this.className = this.classNameForSessionStorage = this.constructor.name;
		// Nest the paths on firebase for better organization with types that have multiple
		// mappings.
		this.firebasePath = this.className + '/' + this.className;
	}

	abstract createInstance();

	castObject(from) {
		var obj = this.createInstance();
		obj.copyFieldsFrom(from);
		return obj;
	}

	copyFieldsFrom(other) {
		for (var prop in other) {
			this[prop] = other[prop];
		}
	}

	public static GetPathToMapping(
			firebasePath: string,
			property: string,
			value: string|number,
			id?: string) {
		var specific = id ? id + '/' : '';
		return (
			firebasePath + 'By' + property.charAt(0).toUpperCase() + property.slice(1) + '/' +
			value + '/' +
			specific);
	}

	// Returns a path to the mapping for a particular unique property on this element. For instance
	// passing in userId for the Permissions object would return 'userPermissions/$myuserid/' where
	// $myuserid is the value of this.userId.
	getPathToMapping(propertyName: string): string {
		return DatabaseObject.GetPathToMapping(
			this.firebasePath,
			propertyName,
			this[propertyName],
			this.id);
	}

	insert() {
		var inserts = this.getInserts();
		DataServices.UpdateMultiple(inserts);
	}

	getInserts(): Object {
		this.id = DataServices.GetNewPushKey(this.firebasePath);
		if (!this.id) {
			console.log('WARN: null push key for path ' + this.firebasePath);
			return [];
		}
		return this.getUpdates();
	}

	update() {
		var updates = this.getUpdates();
		DataServices.UpdateMultiple(updates);
	}

	getUpdates(): Object {
		var updates = {};
		updates[this.firebasePath + '/' + this.id] = this;

		for (var i = 0; i < this.mappingProperties.length; i++) {
			var path = this.getPathToMapping(this.mappingProperties[i]);
			updates[path] = this;
		}
		return updates;
	}

	delete() {
		DataServices.RemoveFirebaseData(this.firebasePath + this.id);
		for (var i = 0; i < this.mappingProperties.length; i++) {
			var path = this.getPathToMapping(this.mappingProperties[i]);
			DataServices.RemoveFirebaseData(path);
		}
	}
}
export default DatabaseObject;
