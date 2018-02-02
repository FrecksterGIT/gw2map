import TemplateElement from "./template-element";
import template from "./templates/notifications.dot";
import {getGuild} from "../data/guilds";
import {getObjectiveName, getMapForObjective, getMapNames, getWorldNameForColor} from "../data/objectives";
import {toTime} from "../utils/timetools";
import {i18next} from "../application";
import {sprintf} from "sprintf-js";

export default class Notifications extends TemplateElement {
	connectedCallback() {
		super.connectedCallback();
		this.initEvents();
	}
	getTemplate() {
		return template;
	}
	initEvents() {
		let newNotificationHandler = this.handleNewNotification.bind(this);
		window.addEventListener("gw2notification", newNotificationHandler);
	}
	addNewOwnerNotification(change, objective) {
		if (objective.type === "Ruins") {
			return;
		}
		getObjectiveName(objective).then(objectiveName => {
			getMapForObjective(objective).then(map => {
				getMapNames().then(mapNames => {
					getWorldNameForColor(objective.owner).then(worldName => {
						// objectiveId, objectiveOldOwnerClass, objectiveName, mapClass, mapName, objectiveOwnerClass, objectiveOwnerName
						let message = sprintf(
							i18next.t("gw2:turnedString"),
							objective.id,
							change.lhs, // old owner color
							objectiveName,
							map.type, // color for map
							mapNames[map.type], // map name
							objective.owner, // owner class
							worldName // owner name
						);
						this.addNewNotification(message, objective.last_flipped);
					});
				});
			});
		});
	}
	addNewClaimNotification(change, objective) {
		if (!change.rhs) {
			return;
		}
		getGuild(change.rhs).then(guild => {
			getObjectiveName(objective).then(objectiveName => {
				// objectiveId, objectiveOwnerClass, objectiveName, guildTag, guildName
				let message = sprintf(i18next.t("gw2:claimedString"), objective.id, objective.owner, objectiveName, guild.tag, guild.name);
				this.addNewNotification(message, objective.claimed_at);
			});
		});
	}
	addNewNotification(notification, date) {
		var notificationTime = toTime(date);
		let entry = document.createElement("div");
		entry.innerHTML = notificationTime + " " + notification;
		let notifications = this.shadowRoot.querySelector(".notifications");
		notifications.insertBefore(entry.cloneNode(true), notifications.firstChild);
	}
	handleNewNotification(changedDataEvent) {
		if (changedDataEvent.data.change.path.length === 5) {
			switch (changedDataEvent.data.change.path[4]) {
				case "owner": {
					this.addNewOwnerNotification(changedDataEvent.data.change, changedDataEvent.data.changedData);
					break;
				}
				case "claimed_by": {
					this.addNewClaimNotification(changedDataEvent.data.change, changedDataEvent.data.changedData);
					break;
				}
				default: {
					// do nothing
				}
			}
		}
	}
}

window.customElements.define("gw2-notifications", Notifications);