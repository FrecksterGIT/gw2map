let worlds = [];

function reorderWorldData(data) {
	let sorted = {};
	data.forEach(currentItem => {
		sorted[currentItem.id] = currentItem;
	});
	return sorted;
}

function getWorlds() {
	if (worlds.length > 0) {
		return Promise.resolve(worlds);
	}
	return fetch("https://api.guildwars2.com/v2/worlds?ids=all").then(result => {
		return result.json().then(data => {
			worlds = reorderWorldData(data);
			return worlds;
		});
	});
}


export {getWorlds};
