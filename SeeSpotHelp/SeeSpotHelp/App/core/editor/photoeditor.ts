
import Photo from '../databaseobjects/photo';
import Activity from '../databaseobjects/activity';
import AnimalStore from '../../stores/animalstore';

import InputPhotoField from './inputphotofield';
import InputTextAreaField from './inputtextareafield';
import InputCheckBoxField from './inputcheckboxfield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';

export default class PhotoEditor extends Editor {
	public databaseObject: Photo;

	constructor(photo) {
		super(photo);
	}

	getInputFields() { return this.inputFields; }

	insert(extraFields) {
		var photo = new Photo()
		photo.updateFromInputFields(this.inputFields);
		photo.groupId = extraFields.groupId;
		photo.animalId = extraFields.animalId;
		photo.userId = extraFields.userId;
		photo.insert();

		var animal = AnimalStore.getAnimalById(photo.animalId);
		if (animal) {
			animal.photoId = photo.id;
			animal.update();
		}

		var activity = Activity.CreatePhotoActivity(photo);
		activity.insert();

		this.databaseObject = photo;
	}

	update() {
		this.databaseObject.updateFromInputFields(this.inputFields);
		this.databaseObject.update();
	}

	createInputFields() {
		this.inputFields = {
			'src': new InputPhotoField(
				this.databaseObject.src, [InputFieldValidation.validateNotEmpty]),
			'comment': new InputTextAreaField([])
		};
	}
}
