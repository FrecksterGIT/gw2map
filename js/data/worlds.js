let worlds = null;
export default class Worlds {

	constructor() {
		if (!worlds) {
			worlds = this;
		}

		// to test whether we have singleton or not
		this.time = new Date();

		return worlds;
	}

	getWorlds() {
		if (this.worlds) {
			return Promise.resolve(this.worlds);
		}
		return fetch("https://api.guildwars2.com/v2/worlds?ids=all").then(result => {
			return result.json().then(data => {
				this.worlds = this.reorderWorldData(data);
				return this.worlds;
			});
		});
	}

	reorderWorldData(data) {
		let sorted = {};
		data.forEach(currentItem => {
			sorted[currentItem.id] = currentItem;
		});
		return sorted;
	}
}
