import diff from 'deep-diff';
import {handleChange} from './changes';

function getMatch(id) {
	return fetch('https://api.guildwars2.com/v2/wvw/matches/' + id).then(response => {
		return response.json();
	});
}

function getMatches() {
	return fetch('https://api.guildwars2.com/v2/wvw/matches').then(response => {
		return response.json().then(matchIds => {
			let matches = [];
			matchIds.forEach(currentItem => {
				matches.push(getMatch(currentItem));
			});
			return Promise.all(matches).then(result => {
				return result;
			});
		});
	});
}

let currentMatchData = {};

function updateMatchData() {
	getMatch('2-2').then(newMatchData => {
		let diffs = diff(currentMatchData, newMatchData);
		if (diffs) {
			diffs.forEach(change => {
				handleChange(change, newMatchData);
			});
		}
		currentMatchData = newMatchData;
	});
}

export {getMatches, getMatch, updateMatchData};
