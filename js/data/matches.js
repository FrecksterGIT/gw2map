import diff from "deep-diff";
import {handleChange} from "../utils/changes";
import Promise from "bluebird";
import fetch from "isomorphic-fetch";
import Cookies from "universal-cookie";

function getMatchId() {
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
}

function getMatch(id) {
	return fetch("https://api.guildwars2.com/v2/wvw/matches/" + id).then(response => {
		return response.json();
	});
}

function getMatches() {
	return fetch("https://api.guildwars2.com/v2/wvw/matches").then(response => {
		return response.json().then(matchIds => {
			return Promise.map(matchIds, currentItem => getMatch(currentItem));
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

export {getMatchId, getMatches, getMatch, updateMatchData, getCurrentMatchData};
