
var EventColors = function () {
	this.colors = [
		'#008080', // Teal
		'#347235', // Green
		'#FFA62F', // Canteloup
		'#C35817',  // Red Fox
		'#7D0541',  // Plum
		'#FC6C85',  // Pink
	];

	this.availableColors = this.colors.slice(0, this.colors.length);
};

EventColors.prototype.GetAvailableColor = function () {
	if (this.availableColors.length > 0) {
		var randomIndex = Math.floor(Math.random() * this.availableColors.length);
		var color = this.availableColors[randomIndex];
		this.availableColors.splice(randomIndex, 1);
		return color;
	} else {
		// I guess just reset the colors if we used all of them.
		this.availableColors = this.colors.slice(0, this.colors.length);;
		return this.GetAvailableColor();
	}
};

EventColors.prototype.RemoveColor = function (color) {
	delete this.availableColors[color];
};

module.exports = EventColors;
