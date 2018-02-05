const changes = {
	sendChangedEventToNotifications(newData, change) {
		let changeEvent = new MessageEvent("gw2notification", {
			bubbles: false,
			composed: false,
			data: {
				change: change,
				changedData: newData
			}
		});
		window.dispatchEvent(changeEvent);
	},

	handleMapChange(newData, change) {
		let changeEvent = new MessageEvent("gw2objective." + newData.id, {
			bubbles: false,
			composed: false,
			data: {
				change: change,
				changedData: newData
			}
		});
		window.dispatchEvent(changeEvent);
		this.sendChangedEventToNotifications(newData, change);
	},

	handleScoreChange(newData, change) {
		let changeEvent = new MessageEvent("gw2scoreboard", {
			bubbles: false,
			composed: false,
			data: {
				change: change,
				changedData: newData
			}
		});
		window.dispatchEvent(changeEvent);
	}
};

export default changes;
