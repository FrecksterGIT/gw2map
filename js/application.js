import * as map from './elements/map';
import * as borderland from './elements/borderland';
import * as objective from './elements/objective';
import * as scorepanel from './elements/scorepanel';

import * as matches from './matches';
import * as objectives from "./objectives";

setInterval(matches.updateMatchData, 5000);

export {objectives, matches, borderland, map, objective, scorepanel};
