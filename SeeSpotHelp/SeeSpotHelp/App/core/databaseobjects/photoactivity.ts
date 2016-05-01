import Activity from './activity';
import Photo from './photo';

export default class PhotoActivity extends Activity {
	constructor(photo: Photo, user) {
		super();
		this.photoId = photo.id;
		this.animalId = photo.animalId;
		this.userId = user.id;
		this.groupId = photo.groupId;
	}

	isPhotoActivity() { return true; }
	editable() { return false; }
}
