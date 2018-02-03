import worldsData from "../static-cache/worlds.json";

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
		return Promise.resolve(worldsData);
	}
}
