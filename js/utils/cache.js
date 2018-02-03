import jsonfile from "jsonfile";
import fetch from "isomorphic-fetch";
import fs from "fs";

fs.mkdirSync("./js/static-cache");

function reorderWorldData(data) {
	let sorted = {};
	data.forEach(currentItem => {
		sorted[currentItem.id] = currentItem;
	});
	return sorted;
}

const MAP_IDS = [38, 1099, 96, 95];
const RELEVANT_OBJECTIVES = ["Castle", "Keep", "Tower", "Camp", "Ruins"];

fetch("https://api.guildwars2.com/v2/worlds?ids=all").then(result => {
	return result.json().then(data => {
		let worlds = reorderWorldData(data);
		jsonfile.writeFile("./js/static-cache/worlds.json", worlds);
	});
});

fetch("https://api.guildwars2.com/v2/wvw/objectives?ids=all").then(response => {
	response.json().then(objs => {
		let objectives = objs.filter(obj => MAP_IDS.indexOf(obj.map_id) >= 0 && RELEVANT_OBJECTIVES.indexOf(obj.type) >= 0);
		jsonfile.writeFile("./js/static-cache/objectives.json", objectives);
	});
});
