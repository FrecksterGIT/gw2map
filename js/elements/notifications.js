import TemplateElement from "./template-element";
import template from "./templates/notifications.dot";
import {getGuild} from "../guilds";
import {getObjectiveName} from "../objectives";

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
		getObjectiveName(objective).then(objectiveName => {
			let entry = document.createElement("entry");
			entry.innerHTML = objective.owner + " flipped " + objectiveName;
			this.shadowRoot.querySelector("div").appendChild(entry.cloneNode(true));
		});
	}
	addNewClaimNotification(change, objective) {
		if (!change.rhs) {
			return;
		}
		getGuild(change.rhs).then(guild => {
			getObjectiveName(objective).then(objectiveName => {
				let entry = document.createElement("entry");
				entry.innerHTML = guild.name + " claimed " + objectiveName;
				this.shadowRoot
					.querySelector("div")
					.appendChild(entry.cloneNode(true));
			});
		});
	}
	handleNewNotification(changedDataEvent) {
		if (changedDataEvent.data.change.path.length === 5) {
			switch (changedDataEvent.data.change.path[4]) {
				case "owner": {
					this.addNewOwnerNotification(
						changedDataEvent.data.change,
						changedDataEvent.data.changedData
					);
					break;
				}
				case "claimed_by": {
					this.addNewClaimNotification(
						changedDataEvent.data.change,
						changedDataEvent.data.changedData
					);
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
