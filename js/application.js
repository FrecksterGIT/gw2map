import GW2Map from "./elements/map";
import Borderland from "./elements/borderland";
import GW2Objective from "./elements/objective";
import Notifications from "./elements/notifications";
import ScorePanel from "./elements/scorepanel";
import {updateMatchData, getMatchId} from "./data/matches";
import {i18next} from "./utils/i18n";

let matchId = getMatchId();
setInterval(updateMatchData, 5000, matchId);
updateMatchData(matchId);

export {Borderland, GW2Map, GW2Objective, ScorePanel, Notifications, i18next};
