import Promise from 'bluebird';
import {sprintf} from 'sprintf-js';
import {getWorlds} from './worlds';
import I18N from '../utils/i18n';
import objectivesDataEn from '../static-cache/objectives_en.json';
import objectivesDataDe from '../static-cache/objectives_de.json';
import objectivesDataFr from '../static-cache/objectives_fr.json';
import objectivesDataEs from '../static-cache/objectives_es.json';
import {getCurrentMatchData} from './matches';

const MAP_SIZES = {
	Center: [[8958, 12798], [12030, 15870]],
	RedHome: [[9214, 8958], [12286, 12030]],
	BlueHome: [[12798, 10878], [15870, 13950]],
	GreenHome: [[5630, 11518], [8702, 14590]]
};

const getObjectives = () => {
	switch (I18N.getCurrentLanguage()) {
		case 'de':
			return Promise.resolve(objectivesDataDe);
		case 'fr':
			return Promise.resolve(objectivesDataFr);
		case 'es':
			return Promise.resolve(objectivesDataEs);
		default:
			return Promise.resolve(objectivesDataEn);
	}
};

const getObjectiveName = objective => {
	return getObjectives().then(objs => {
		return objs.find(obj => obj.id === objective.id).name;
	});
};

const getMapNames = match_worlds => {
	if (!match_worlds) {
		return Promise.resolve({
			Center: I18N.t('gw2:eb'),
			RedHome: sprintf(I18N.t('gw2:borderlands'), 'Red'),
			BlueHome: sprintf(I18N.t('gw2:borderlands'), 'Blue'),
			GreenHome: sprintf(I18N.t('gw2:borderlands'), 'Green')
		});
	}
	return getWorlds().then(worlds => {
		return {
			Center: I18N.t('gw2:eb'),
			RedHome: sprintf(I18N.t('gw2:borderlands'), worlds[match_worlds.red].name),
			BlueHome: sprintf(I18N.t('gw2:borderlands'), worlds[match_worlds.blue].name),
			GreenHome: sprintf(I18N.t('gw2:borderlands'), worlds[match_worlds.green].name)
		};
	});
};

const getWorldNameForColor = color => {
	return getWorlds().then(worlds => {
		let match = getCurrentMatchData();
		if (!match || !match.worlds) {
			return color;
		}
		return worlds[match.worlds[color.toLowerCase()]].name;
	});
};

const getObjectivePosition = objective => {
	let map = MAP_SIZES[objective.map_type];
	let mapSize = [[map[1][0] - map[0][0]], map[1][1] - map[0][1]];
	let point = objective.coord;
	if (point) {
		let coord = [point[0] - map[0][0], point[1] - map[0][1]];
		return [coord[0] / mapSize[0] * 100, coord[1] / mapSize[1] * 100];
	}
	return [0, 0];
};

export {getObjectives, getObjectivePosition, getObjectiveName, getMapNames, getWorldNameForColor};
