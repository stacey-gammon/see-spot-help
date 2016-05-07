
import Photo from '../databaseobjects/photo';
import Activity from '../databaseobjects/activity';
import AnimalStore from '../../stores/animalstore';

import InputPhotoField from './inputphotofield';
import InputTextAreaField from './inputtextareafield';
import InputCheckBoxField from './inputcheckboxfield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';
/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 */
var AWS_ACCESS_KEY_ID='AKIAIUMFKS4SNDR4KS7A';
var AWS_SECRET_ACCESS_KEY='fhZxKzCC6cYlZQlqoEx0+YRJuydbgEcBVEMKOykX';

export default class PhotoEditor extends Editor {
  public databaseObject: Photo;

  constructor(photo) {
    super(photo);
  }

  getInputFields() { return this.inputFields; }

  insert(extraFields) {
    var s3 = new AWS.S3();

    var objKey = 'facebook-' + extraFields.userId + '/' +
      this.databaseObject.animalId + '/' +
      this.databaseObject.file.name;

    var params = {
      Bucket: 'theshelterhelper',
      Key: objKey,
      ContentType: this.databaseObject.file.type,
      Body: this.databaseObject.file,
      ACL: 'public-read'
    };

    s3.putObject(params, function (err, data) {
      console.log('object putted: ', err);
      if (!err) {
        extraFields.src = 'https://s3.amazonaws.com/theshelterhelper/' + objKey;
        this.insertPhoto(extraFields);
      }
     }.bind(this));
  }

  insertPhoto(extraFields) {
    var photo = new Photo()
    photo.updateFromInputFields(this.inputFields);
    photo.groupId = extraFields.groupId;
    photo.animalId = extraFields.animalId;
    photo.userId = extraFields.userId;
    photo.src = extraFields.src;
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
