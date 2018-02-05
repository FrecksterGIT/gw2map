import Promise from "bluebird";
import TemplateElement from "./template-element";
import template from "./templates/gw2-objective.tpl";
import {getGuild} from "../data/guilds";
import timetools from "../utils/timetools";
import DefineMap from "can-define/map/map";
import {registerViewModel} from "../data/data-observer";

export default class GW2Objective extends TemplateElement {
	initViewModel() {
		const Objective = DefineMap.extend({
			id: {type: "string"},
			type: {type: "string", "default": this.getAttribute("type")},
			name: {type: "string", "default": this.getAttribute("name")},
			owner: {type: "string"},
			last_flipped: {type: "string"},
			claimed_by: {type: "string"},
			claimed_at: {type: "string"},
			points_tick: {type: "number"},
			points_capture: {type: "number"},
			yaks_delivered: {type: "observable"},
			guild_upgrades: {type: "observable"},
			tierInfo: {
				value: prop => {
					prop.listenTo("yaks_delivered", function() {
						if (this.yaks_delivered >= 140) {
							prop.resolve(3);
						}
						else if (this.yaks_delivered >= 60) {
							prop.resolve(2);
						}
						else if (this.yaks_delivered >= 20) {
							prop.resolve(1);
						}
						else {
							prop.resolve(0);
						}
					});
				}
			},
			dolyakInfo: {
				value: prop => {
					prop.listenTo("yaks_delivered", function() {
						if (this.yaks_delivered >= 140) {
							prop.resolve("");
						}
						else if (this.yaks_delivered >= 60) {
							prop.resolve(this.yaks_delivered - 60 + " / 80");
						}
						else if (this.yaks_delivered >= 20) {
							prop.resolve(this.yaks_delivered - 20 + " / 40");
						}
						else {
							prop.resolve(this.yaks_delivered + " / 20");
						}
					});
				}
			},
			guildInfo: {
				value: prop => {
					prop.listenTo("claimed_by", function() {
						if (!this.claimed_by) {
							prop.resolve("");
						}
						else {
							getGuild(this.claimed_by).then(guildData => {
								prop.resolve(guildData.name + " [" + guildData.tag + "]");
							});
						}
					});
				}
			}
		});
		this.viewModel = new Objective();
		registerViewModel(this.getAttribute("id"), "objective", this.viewModel);
		return Promise.resolve(this.viewModel);
	}

	getTemplate() {
		return template;
	}

	templateRendered() {
		if (!this.isRuins()) {
			const initTimeUpdatesHandler = this.initTimeUpdates.bind(this);
			const stopTimeUpdatesHandler = this.stopTimeUpdates.bind(this);
			const turnedTimerHandler = this.initTurnedTimer.bind(this);
			this.addEventListener("mouseover", initTimeUpdatesHandler);
			this.addEventListener("mouseout", stopTimeUpdatesHandler);
			this.viewModel.on("owner", turnedTimerHandler);
		}
	}

	isRuins() {
		return this.getAttribute("type") === "Ruins";
	}

	initTimeUpdates() {
		if (!this.timeUpdates) {
			let timeEventHandler = this.updateTimeInfos.bind(this);
			this.timeUpdates = setInterval(timeEventHandler, 1000);
			timeEventHandler();
		}
	}

	stopTimeUpdates() {
		if (!this.shadowRoot.querySelector(".objective").classList.contains("turned")) {
			clearInterval(this.timeUpdates);
			this.timeUpdates = null;
		}
	}

	updateTimeInfos() {
		this.shadowRoot.querySelector(".timer").innerHTML = timetools.getPassedTime(this.viewModel.last_flipped);

		if (this.viewModel.claimed_at) {
			this.shadowRoot.querySelector(".claimed").innerHTML = timetools.getPassedTime(this.viewModel.claimed_at);
		}
	}

	updateTurnedTimer() {
		let timeSinceFlipped = timetools.diffTime(this.viewModel.last_flipped);
		if (timeSinceFlipped < timetools.COUNTDOWN_TIME) {
			this.shadowRoot.querySelector(".turnedtext").innerHTML = timetools.getCountdown(this.viewModel.last_flipped);
			this.shadowRoot.querySelector(".objective").classList.add("turned");
		}
		else {
			clearInterval(this.turnedTimer);
			this.turnedTimer = null;
			this.shadowRoot.querySelector(".objective").classList.remove("turned");
		}
	}

	initTurnedTimer() {
		if (this.viewModel.last_flipped) {
			let timeSinceFlipped = timetools.diffTime(this.viewModel.last_flipped);
			if (timeSinceFlipped < timetools.COUNTDOWN_TIME) {
				const updateTurnedTimerHander = this.updateTurnedTimer.bind(this);
				this.turnedTimer = setInterval(updateTurnedTimerHander, 1000);
			}
		}
	}
}

window.customElements.define("gw2-objective", GW2Objective);
