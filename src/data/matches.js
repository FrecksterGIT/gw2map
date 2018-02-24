import Promise from 'bluebird';
import Cookies from 'universal-cookie';
import {updateAllData} from './data-observer';

const getMatchId = () => {
	const cookies = new Cookies();
	let matchId = cookies.get('gw2-world');
	if (!matchId) {
		matchId = '2-1';
	}
	let urlMatch = window.location.pathname.match(/\d+-\d+/);
	if (urlMatch) {
		matchId = urlMatch[0];
	}
	cookies.set('gw2-world', matchId);
	return matchId;
};

const setMatchId = matchId => {
	const cookies = new Cookies();
	cookies.set('gw2-world', matchId);
};

const getMatch = id => {
	return fetch('https://api.guildwars2.com/v2/wvw/matches/' + id).then(response => {
		return response.json();
	});
};

const getMatches = () => {
	return fetch('https://api.guildwars2.com/v2/wvw/matches').then(response => {
		return response.json().then(matchIds => {
			return Promise.map(matchIds, currentItem => getMatch(currentItem));
		});
	});
};

let currentMatchData = {};

let matchUpdater;

const getCurrentMatchData = () => {
	return currentMatchData;
};

const initMatchUpdates = () => {
	let matchId = getMatchId();
	getMatch(matchId).then(match => {
		currentMatchData = match;
		updateAllData(match);
		matchUpdater = setInterval(function() {
			matchId = getMatchId();
			getMatch(matchId).then(data => {
				currentMatchData = data;
				updateAllData(data);
			});
		}, 5000);
	});
};

const stopMatchUpdates = () => {
	clearInterval(matchUpdater);
};

export {getMatchId, setMatchId, getMatches, getMatch, initMatchUpdates, stopMatchUpdates, getCurrentMatchData};
