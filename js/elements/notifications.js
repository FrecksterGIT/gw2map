import TemplateElement from "./template-element";
import template from "./templates/notifications.dot";

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
		window.addEventListener("gw2objective", newNotificationHandler);
	}
	handleNewNotification(changedDataEvent) {
		console.log(changedDataEvent);
	}
}

window.customElements.define("gw2-notifications", Notifications);
