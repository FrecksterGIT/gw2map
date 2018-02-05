import Promise from "bluebird";
import Cookies from "universal-cookie";
import Map from "can-map";
import changes from "../utils/changes";
import fetch from "isomorphic-fetch";

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

const getCurrentMatchData = () => {
	return currentMatchData;
};

const initMatchUpdates = () => {
	const matchId = getMatchId();
	const objectives = {};
	getMatch(matchId).then(match => {
		currentMatchData = match;
		const matchObserver = new Map(match);
		matchObserver.bind("change", function(ev, attr, how, newVal, oldVal) {
			const change = {
				attr: attr,
				lhs: oldVal,
				rhs: newVal
			};
			changes.handleScoreChange(this, change);
		});

		match.maps.forEach(map => {
			map.objectives.forEach(obj => {
				const observer = new Map(obj);
				observer.bind("change", function(ev, attr, how, newVal, oldVal) {
					const change = {
						attr: attr,
						lhs: oldVal,
						rhs: newVal
					};
					changes.handleMapChange(this, change);
				});
				objectives[obj.id] = observer;
				changes.handleMapChange(obj, {});
			});
		});

		setInterval(function() {
			getMatch(matchId).then(updatedMatch => {
				matchObserver.attr(updatedMatch);
				match.maps.forEach(map => {
					map.objectives.forEach(obj => {
						objectives[obj.id].attr(obj);
					});
				});
			});
		}, 5000);
	});
};

export {getMatchId, getMatches, getMatch, initMatchUpdates, getCurrentMatchData};
