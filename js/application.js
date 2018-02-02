import GW2Map from "./elements/map";
import Borderland from "./elements/borderland";
import GW2Objective from "./elements/objective";
import Notifications from "./elements/notifications";
import ScorePanel from "./elements/scorepanel";
import Cookies from "universal-cookie";
import {updateMatchData} from "./data/matches";
import {i18next} from "./utils/i18n";

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

setInterval(updateMatchData, 5000, getMatchId());

export {Borderland, GW2Map, GW2Objective, ScorePanel, Notifications, i18next};
