import TemplateElement from "./template-element";
import template from './templates/scorepanel.dot';
import {getMatches} from "../matches";
import {getWorlds} from "../worlds";

export default class ScorePanel extends TemplateElement {

	connectedCallback() {
		super.connectedCallback();
		this.initEvents();
	}

	getTemplate() {
		return template;
	}

	getTemplateData() {
		let matches = [];
		return new Promise(resolve => {
			getWorlds().then(worlds => {
				getMatches().then(result => {
					result.forEach(match => {
						match.currentScores = this.getCurrentScores(match);
						match.income = this.getIncome(match);
						match.world_names = {};
						match.world_names.red = worlds[match.worlds.red].name;
						match.world_names.blue = worlds[match.worlds.blue].name;
						match.world_names.green = worlds[match.worlds.green].name;

						let addRedWorlds = match.all_worlds.red.filter(item => item !== match.worlds.red).map(world => worlds[world].name);
						let addBlueWorlds = match.all_worlds.blue.filter(item => item !== match.worlds.blue).map(world => worlds[world].name);
						let addGreenWorlds = match.all_worlds.green.filter(item => item !== match.worlds.green).map(world => worlds[world].name);
						match.all_world_names = {};
						match.all_world_names.red = addRedWorlds.join(', ');
						match.all_world_names.blue = addBlueWorlds.join(', ');
						match.all_world_names.green = addGreenWorlds.join(', ');

						matches.push(match);
					});
					resolve({matches: matches});
				});
			});
		});
	}

	initEvents() {
		let changeEventHandler = this.redraw.bind(this);
		window.addEventListener('gw2scoreboard', changeEventHandler);
	}

	redraw(changedDataEvent) {
		let data = changedDataEvent.data.changedData;
		let table = this.shadowRoot.querySelector('table[data-match-id="' + data.id + '"]');
		let scores = this.getCurrentScores(data);
		table.classList.add("active");
		table.querySelector(".green_world .current_score").innerHTML = scores.green;
		table.querySelector(".blue_world .current_score").innerHTML = scores.blue;
		table.querySelector(".red_world .current_score").innerHTML = scores.red;
	}

	getCurrentScores(match) {
		let scores = 0;
		let skirmishId = 0;
		match.skirmishes.forEach(skirmish => {
			if (skirmish.id > skirmishId) {
				scores = skirmish.scores;
				skirmishId = skirmish.id;
			}
		});
		return scores;
	}

	getIncome(match) {
		let income = {
			Red: 0,
			Blue: 0,
			Green: 0
		};
		match.maps.forEach(map => {
			map.objectives.forEach(objective => {
				if (objective.owner && objective.points_tick) {
					income[objective.owner] += objective.points_tick;
				}
			});
		});
		return income;
	}
}

window.customElements.define('gw2-scorepanel', ScorePanel);

