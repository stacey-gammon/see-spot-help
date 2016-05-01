// ﻿
// var Group = require('./group');
// var Animal = require('./animal');
//
// function FakeData() {}
//
// FakeData.getFakeAnimalData = function () {
// 	var fakeGroups = Group.getFakeGroups();
// 	return {
// 		"123": {
// 			"dogId1": new Animal(
// 				"Coco",
// 				"Dog",
// 				"Pitbull",
// 				1,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/dogthumbnails-4.jpg",
// 				"dogId1"),
// 			"dogId2": new Animal(
// 				"Fluffy",
// 				"Dog",
// 				"Newfoundland",
// 				5,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/dogthumbnails-5.jpg",
// 				"dogId2"),
// 			"dogId4": new Animal(
// 				"Max",
// 				"Dog",
// 				"Lab",
// 				10,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/dogthumbnails.jpg",
// 				"dogId4"),
// 			"dogId3": new Animal(
// 				"Jack",
// 				"Dog",
// 				"Pittie",
// 				2,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/ebony.jpg",
// 				"dogId3"),
// 			"dogId6": new Animal(
// 				"Lena",
// 				"Dog",
// 				"Pittie",
// 				2,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.PTS,
// 				"../../images/lena.jpg",
// 				"dogId6"),
// 			"dogId7": new Animal(
// 				"Penny",
// 				"Dog",
// 				"Pittie",
// 				4,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/dogthumbnails-6.jpg",
// 				"dogId7"),
// 			"dogId8": new Animal(
// 				"Maestro",
// 				"Dog",
// 				"Pittie",
// 				4,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/dogthumbnails-7.jpg",
// 				"dogId8"),
// 			"dogId9": new Animal(
// 				"Snickers",
// 				"Dog",
// 				"Pittie",
// 				2,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/dogthumbnails-8.jpg",
// 				"dogId9"),
// 			"dogId10": new Animal(
// 				"Snickers",
// 				"Dog",
// 				"Pittie",
// 				2,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/dogthumbnails-9.jpg",
// 				"dogId10"),
// 			"dogId11": new Animal(
// 				"Apollo",
// 				"Dog",
// 				"Pittie",
// 				2,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/dogthumbnails-10.jpg",
// 				"dogId11"),
// 			"dogId12": new Animal(
// 				"Marty",
// 				"Dog",
// 				"Pittie",
// 				2,
// 				fakeGroups["123"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/dogthumbnails-11.jpg",
// 				"dogId12")
// 			},
// 		"456": {
// 			"dogId3": new Animal(
// 				"Jack",
// 				"Dog",
// 				"Russel Terrier",
// 				2,
// 				fakeGroups["456"],
// 				Animal.StatusEnum.ADOPTABLE,
// 				"../../images/ebony.jpg",
// 				"dogId3")
// 		}
// 	};
// }
// 
// FakeData.getFakeAnimalDataForGroup = function(groupId) {
// 	return this.getFakeAnimalData()[groupId];
// };
//
// module.exports = FakeData;
