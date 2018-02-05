import Promise from "bluebird";
import TemplateElement from "./template-element";
import template from "./templates/gw2-objective.dot";
import {getGuild} from "../data/guilds";
import timetools from "../utils/timetools";

export default class GW2Objective extends TemplateElement {
	getTemplate() {
		return template;
	}
	getTemplateData() {
		return Promise.resolve({
			type: this.getAttribute("type"),
			name: this.getAttribute("name")
		});
	}

	templateRendered() {
		let changeEventHandler = this.redraw.bind(this);
		window.addEventListener("gw2objective." + this.getAttribute("id"), changeEventHandler);
		if (!this.isRuins()) {
			let initTimeUpdatesHandler = this.initTimeUpdates.bind(this);
			let stopTimeUpdatesHandler = this.stopTimeUpdates.bind(this);
			this.addEventListener("mouseover", initTimeUpdatesHandler);
			this.addEventListener("mouseout", stopTimeUpdatesHandler);
		}
	}

	isRuins() {
		return this.getAttribute("type") === "Ruins";
	}
	initTimeUpdates() {
		if (!this.timeUpdates) {
			let timeEventHandler = this.updateTimeInfos.bind(this);
			this.timeUpdates = setInterval(timeEventHandler, 1000);
		}
	}
	stopTimeUpdates() {
		if (!this.shadowRoot.querySelector(".objective").classList.contains("turned")) {
			clearInterval(this.timeUpdates);
			this.timeUpdates = null;
		}
	}
	updateTimeInfos() {
		if (this.objectiveData) {
			let timeSinceFlipped = timetools.diffTime(this.objectiveData.last_flipped);
			if (timeSinceFlipped < timetools.COUNTDOWN_TIME) {
				this.shadowRoot.querySelector(".turnedtext").innerHTML = timetools.getCountdown(this.objectiveData.last_flipped);
				this.shadowRoot.querySelector(".objective").classList.add("turned");
				this.initTimeUpdates();
			}
			else {
				this.shadowRoot.querySelector(".objective").classList.remove("turned");
			}
			this.shadowRoot.querySelector(".timer").innerHTML = timetools.getPassedTime(this.objectiveData.last_flipped);

			if (this.objectiveData.claimed_at) {
				this.shadowRoot.querySelector(".claimed").innerHTML = timetools.getPassedTime(this.objectiveData.claimed_at);
			}
		}
	}

	getDollies() {
		let yaks = this.objectiveData.yaks_delivered;
		if (yaks >= 140) {
			return "";
		}
		if (yaks >= 60) {
			return yaks - 60 + " / 80";
		}
		if (yaks >= 20) {
			return yaks - 20 + " / 40";
		}
		return yaks + " / 20";
	}

	getTier() {
		let yaks = this.objectiveData.yaks_delivered;
		if (yaks >= 140) {
			return 3;
		}
		if (yaks >= 60) {
			return 2;
		}
		if (yaks >= 20) {
			return 1;
		}
		return 0;
	}

	setOwner() {
		this.shadowRoot.querySelector(".objective").setAttribute("owner", this.objectiveData.owner);
	}

	setGuild() {
		if (this.objectiveData.claimed_by) {
			this.shadowRoot.querySelector(".objective").setAttribute("claimed", "");
			getGuild(this.objectiveData.claimed_by).then(guildData => {
				this.shadowRoot.querySelector(".guild_name").innerHTML = guildData.name;
				this.shadowRoot.querySelector(".guild_tag").innerHTML = guildData.tag;
			});
		}
		else {
			this.shadowRoot.querySelector(".objective").removeAttribute("claimed");
		}
	}

	setDollieCount() {
		let tier = this.getTier();
		this.shadowRoot.querySelector(".objective").setAttribute("tier", tier);
		if (tier === 3) {
			this.shadowRoot.querySelector(".dollies").classList.add("hidden");
		}
		else {
			this.shadowRoot.querySelector(".dollies").classList.remove("hidden");
			this.shadowRoot.querySelector(".dollies").innerHTML = this.getDollies();
		}
	}

	redraw(changedDataEvent) {
		console.log(this.getAttribute("name"), changedDataEvent.data);
		this.objectiveData = changedDataEvent.data.changedData;
		this.setOwner();
		if (!this.isRuins()) {
			this.updateTimeInfos();
			this.setDollieCount();
			this.setGuild();
		}
	}
}

window.customElements.define("gw2-objective", GW2Objective);
