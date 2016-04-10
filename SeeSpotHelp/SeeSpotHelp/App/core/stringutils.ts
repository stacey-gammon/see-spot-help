

export default class StringUtils {
	public static MakeSearchable(field) {
		return field.toLowerCase().replace(/\W/g, '');
	}
}
