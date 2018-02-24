import jsonfile from 'jsonfile';
import fetch from 'isomorphic-fetch';
import fs from 'fs';

const STATIC_CACHE_DIR = './src/static-cache';

fs.mkdirSync(STATIC_CACHE_DIR);

function reorderWorldData(data) {
	let sorted = {};
	data.forEach(currentItem => {
		sorted[currentItem.id] = currentItem;
	});
	return sorted;
}

const MAP_IDS = [38, 1099, 96, 95];
const RELEVANT_OBJECTIVES = ['Castle', 'Keep', 'Tower', 'Camp', 'Ruins'];

const LANGUAGES = ['en', 'de', 'es', 'fr'];

LANGUAGES.forEach(language => {
	fetch('https://api.guildwars2.com/v2/worlds?ids=all&lang=' + language).then(result => {
		return result.json().then(data => {
			let worlds = reorderWorldData(data);
			jsonfile.writeFile(STATIC_CACHE_DIR + '/worlds_' + language + '.json', worlds);
		});
	});

	fetch('https://api.guildwars2.com/v2/wvw/objectives?ids=all&lang=' + language).then(response => {
		response.json().then(objs => {
			let objectives = objs.filter(obj => MAP_IDS.indexOf(obj.map_id) >= 0 && RELEVANT_OBJECTIVES.indexOf(obj.type) >= 0);
			jsonfile.writeFile(STATIC_CACHE_DIR + '/objectives_' + language + '.json', objectives);
		});
	});
});
