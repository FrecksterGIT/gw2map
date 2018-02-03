const changes = {
	sendChangedEventToNotifications(change, newObjectiveData) {
		let changeEvent = new MessageEvent("gw2notification", {
			bubbles: false,
			composed: false,
			data: {
				type: change.kind,
				change: change,
				changedData: newObjectiveData
			}
		});
		window.dispatchEvent(changeEvent);
	},

	sendChangeEventToObjective(change, newObjectiveData) {
		let changeEvent = new MessageEvent("gw2objective." + newObjectiveData.id, {
			bubbles: false,
			composed: false,
			data: {
				type: change.kind,
				change: change,
				changedData: newObjectiveData
			}
		});
		window.dispatchEvent(changeEvent);
		this.sendChangedEventToNotifications(change, newObjectiveData);
	},

	sendChangeEventToScoreboard(change, newData) {
		let changeEvent = new MessageEvent("gw2scoreboard", {
			bubbles: false,
			composed: false,
			data: {
				type: change.kind,
				changedData: newData
			}
		});
		window.dispatchEvent(changeEvent);
	},
	handleMapChange(change, newData) {
		if (change.path.length === 1) {
			change.rhs.forEach(map => {
				map.objectives.forEach(newObjectiveData => {
					this.sendChangeEventToObjective(change, newObjectiveData);
				});
			});
			return;
		}
		if (change.path.length >= 4) {
			if (change.path[2] === "objectives") {
				let newObjectiveData = newData[change.path[0]][change.path[1]][change.path[2]][change.path[3]];
				this.sendChangeEventToObjective(change, newObjectiveData);
				return;
			}
		}
	},

	handleScoreChange(change, newData) {
		this.sendChangeEventToScoreboard(change, newData);
	},

	handleChange(change, newData) {
		switch (change.path[0]) {
			case "maps": {
				this.handleMapChange(change, newData);
				break;
			}
			case "scores": {
				this.handleScoreChange(change, newData);
				break;
			}
			default: {
				// console.warn("unhandled change", change);
			}
		}
	}
};

export default changes;
