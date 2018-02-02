import diff from 'deep-diff';
import {handleChange} from '../utils/changes';
import Promise from 'bluebird';

function getMatch(id) {
	return fetch('https://api.guildwars2.com/v2/wvw/matches/' + id).then(response => {
		return response.json();
	});
}

function getMatches() {
	return fetch('https://api.guildwars2.com/v2/wvw/matches').then(response => {
		return response.json().then(matchIds => {
			return Promise.map(matchIds, (currentItem) => getMatch(currentItem));
		});
	});
}

let currentMatchData = {};

function updateMatchData(match) {
	getMatch(match).then(newMatchData => {
		let diffs = diff(currentMatchData, newMatchData);
		if (diffs) {
			diffs.forEach(change => {
				handleChange(change, newMatchData);
			});
		}
		currentMatchData = newMatchData;
	});
}

function getCurrentMatchData() {
	return currentMatchData;
}

export {getMatches, getMatch, updateMatchData, getCurrentMatchData};
