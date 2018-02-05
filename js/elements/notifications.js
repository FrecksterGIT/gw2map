import TemplateElement from "./template-element";
import template from "./templates/notifications.tpl";
import {getGuild} from "../data/guilds";
import {getObjectiveName, getMapNames, getWorldNameForColor} from "../data/objectives";
import timetools from "../utils/timetools";
import I18N from "../utils/i18n";
import {sprintf} from "sprintf-js";
import DefineList from "can-define/list/list";

/* TODO
	viewModel should be a defineList of notification
	register the viewModel for all interesting objectives and listen for owner and claim changes
*/

export default class Notifications extends TemplateElement {
	initViewModel() {
		this.viewModel = new DefineList([]);
		return Promise.resolve(this.viewModel);
	}

	getTemplate() {
		return template;
	}

	templateRendered() {
		let newNotificationHandler = this.handleNewNotification.bind(this);
		window.addEventListener("gw2notification", newNotificationHandler);
	}

	addNewOwnerNotification(change, objective) {
		console.log(change);
		if (objective.type === "Ruins" || objective.type === "Mercenary") {
			return;
		}
		getObjectiveName(objective)
			.then(objectiveName => {
				return getMapNames(objective.match_worlds).then(mapNames => {
					return getWorldNameForColor(objective.owner).then(worldName => {
						// objectiveId, objectiveOldOwnerClass, objectiveName, mapClass, mapName, objectiveOwnerClass, objectiveOwnerName
						let message = sprintf(
							I18N.t("gw2:turnedString"),
							objective.id,
							change.lhs, // old owner color
							objectiveName,
							objective.map_type, // color for map
							mapNames[objective.map_type], // map name
							objective.owner, // owner class
							worldName // owner name
						);
						this.addNewNotification(message, objective.last_flipped, "flipped");
					});
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	addNewClaimNotification(change, objective) {
		if (!change.rhs) {
			return;
		}
		getGuild(change.rhs).then(guild => {
			getObjectiveName(objective)
				.then(objectiveName => {
					// objectiveId, objectiveOwnerClass, objectiveName, guildTag, guildName
					let message = sprintf(I18N.t("gw2:claimedString"), objective.id, objective.owner, objectiveName, guild.tag, guild.name);
					this.addNewNotification(message, objective.claimed_at, "claimed");
				})
				.catch(err => {
					console.log(err);
				});
		});
	}

	addNewNotification(notification, date, type) {
		var notificationTime = timetools.toTime(date);
		this.viewModel.unshift({
			timestamp: Date.parse(date),
			date: notificationTime,
			message: notification,
			type: type
		});
	}

	handleNewNotification(changedDataEvent) {
		switch (changedDataEvent.data.type) {
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

window.customElements.define("gw2-notifications", Notifications);
