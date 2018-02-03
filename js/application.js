import GW2Map from "./elements/map";
import Borderland from "./elements/borderland";
import GW2Objective from "./elements/objective";
import Notifications from "./elements/notifications";
import ScorePanel from "./elements/scorepanel";
import {updateMatchData, getMatchId} from "./data/matches";
import I18N from "./utils/i18n";
import en from "../locales/en.json";
import de from "../locales/de.json";
import fr from "../locales/fr.json";
import es from "../locales/es.json";

I18N.init({
	lng: "en",
	resources: {
		en: {
			gw2: en
		},
		de: {
			gw2: de
		},
		fr: {
			gw2: fr
		},
		es: {
			gw2: es
		}
	}
});

let matchId = getMatchId();
setInterval(updateMatchData, 5000, matchId);
updateMatchData(matchId);

export {Borderland, GW2Map, GW2Objective, ScorePanel, Notifications};
