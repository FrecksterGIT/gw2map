import Promise from "bluebird";
import Cookies from "universal-cookie";
import diff from "deep-diff";
import changes from "../utils/changes";

const getMatchId = () => {
	const cookies = new Cookies();
	let matchId = cookies.get("gw2-world");
	if (!matchId) {
		matchId = "2-1";
	}
	let urlMatch = window.location.pathname.match(/\d+-\d+/);
	if (urlMatch) {
		matchId = urlMatch[0];
	}
	cookies.set("gw2-world", matchId);
	return matchId;
};

const getMatch = id => {
	return fetch("https://api.guildwars2.com/v2/wvw/matches/" + id).then(response => {
		return response.json();
	});
};

const getMatches = () => {
	return fetch("https://api.guildwars2.com/v2/wvw/matches").then(response => {
		return response.json().then(matchIds => {
			return Promise.map(matchIds, currentItem => getMatch(currentItem));
		});
	});
};

let currentMatchData = {};

const updateMatchData = match => {
	getMatch(match).then(newMatchData => {
		let diffs = diff(currentMatchData, newMatchData);
		if (diffs) {
			diffs.forEach(change => {
				changes.handleChange(change, newMatchData);
			});
		}
		currentMatchData = newMatchData;
	});
};

const getCurrentMatchData = () => {
	return currentMatchData;
};

export {getMatchId, getMatches, getMatch, updateMatchData, getCurrentMatchData};
