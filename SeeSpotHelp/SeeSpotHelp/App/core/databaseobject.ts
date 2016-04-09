import DataServices = require('./dataservices');
import Utils = require('./utils');

abstract class DatabaseObject {
	public timestamp: number = Date.now();
	public id: string;
	public abstract classNameForSessionStorage;
	public abstract firebasePath;

	// If the object wants to store duplicate entries of itself, mapped by a particular unique
	// attribute, it should add the properties in here.
	public mappingProperties: Array<string> = [];

	constructor() { }

	abstract createInstance();

	castObject(from) {
		var obj = this.createInstance();
		obj.copyFieldsFrom(from);
		return obj;
	}

	public static GetPathToMapping(firebasePath: string, property: string, value: string|number) {
		return firebasePath +
			'By' +
			property.charAt(0).toUpperCase() +
			property.slice(1) +
			'/' +
			value +
			'/';
	}

	// Returns a path to the mapping for a particular unique property on this element. For instance
	// passing in userId for the Permissions object would return 'userPermissions/$myuserid/' where
	// $myuserid is the value of this.userId.
	getPathToMapping(propertyName: string): string {
		return DatabaseObject.GetPathToMapping(this.firebasePath, propertyName, this[propertyName]);
	}

	insert() {
		this.id = DataServices.PushFirebaseData(this.firebasePath, this).id;
		DataServices.UpdateFirebaseData(this.firebasePath + this.id, this);

		for (var i = 0; i < this.mappingProperties.length; i++) {
			var path = this.getPathToMapping(this.mappingProperties[i]);
			DataServices.UpdateFirebaseData(path, this);
		}
	}

	update() {
		DataServices.UpdateFirebaseData(this.firebasePath + this.id, this);
	}

	delete() {
		DataServices.RemoveFirebaseData(this.firebasePath + this.id);
	}
}

export = DatabaseObject;
