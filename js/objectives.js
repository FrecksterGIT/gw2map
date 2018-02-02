const MAP_SIZES = {
	Center: [[8958, 12798], [12030, 15870]],
	RedHome: [[9214, 8958], [12286, 12030]],
	BlueHome: [[12798, 10878], [15870, 13950]],
	GreenHome: [[5630, 11518], [8702, 14590]]
};
const MAP_IDS = [38, 1099, 96, 95];

const RELEVANT_OBJECTIVES = ["Castle", "Keep", "Tower", "Camp", "Ruins"];

let objectives = [];

function getObjectives() {
	if (objectives.length > 0) {
		return Promise.resolve(objectives);
	}
	else {
		return fetch(
			"https://api.guildwars2.com/v2/wvw/objectives?ids=all"
		).then(response => {
			return response.json().then(objs => {
				objectives = objs.filter(
					obj =>
						MAP_IDS.indexOf(obj.map_id) >= 0 &&
						RELEVANT_OBJECTIVES.indexOf(obj.type) >= 0
				);
				return objectives;
			});
		});
	}
}

function getObjectiveName(objective) {
	return getObjectives().then(objs => {
		objs.forEach(obj => {
			if (objective.id === obj.id) {
				return obj.name;
			}
		});
	});
}

function getObjectivePosition(objective) {
	let map = MAP_SIZES[objective.map_type];
	let mapSize = [[map[1][0] - map[0][0]], map[1][1] - map[0][1]];
	let point = objective.coord;
	if (point) {
		let coord = [point[0] - map[0][0], point[1] - map[0][1]];
		return [[coord[0] / mapSize[0] * 100], [coord[1] / mapSize[1] * 100]];
	}
	return [0, 0];
}

export {getObjectives, getObjectivePosition, getObjectiveName};
