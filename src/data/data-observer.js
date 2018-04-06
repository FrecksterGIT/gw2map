const singleton = Symbol();
const singletonEnforcer = Symbol();

class DataObserver {
	constructor(enforcer) {
		if (enforcer !== singletonEnforcer) {
			throw new Error('singleton: use .instance getter instead of new operator.');
		}
		this._type = 'DataObserver';
		this.viewModels = {};
	}

	static get instance() {
		if (!this[singleton]) {
			this[singleton] = new DataObserver(singletonEnforcer);
		}
		return this[singleton];
	}

	registerViewModel(id, type, viewModel) {
		if (typeof viewModel.assign !== 'function') {
			throw new Error('not a valid viewModel');
		}
		if (!['objective', 'match'].includes(type)) {
			throw new Error('not a valid dataobserver type: ' + type);
		}
		if (!this.viewModels[type]) {
			this.viewModels[type] = {};
		}
		if (this.viewModels[type][id]) {
			this.viewModels[type][id].push(viewModel);
		}
		else {
			this.viewModels[type][id] = [viewModel];
		}
	}

	updateAllData(data) {
		this.deliverUpdate({
			type: 'match',
			id: data.id,
			data: data
		});
		data.maps.forEach(map => {
			map.objectives.forEach(objective => this.updateObjective(objective, map, data.worlds));
		});
	}

	updateObjective(objective, map, worlds) {
		objective.map_id = map.id;
		objective.map_type = map.type;
		objective.match_worlds = worlds;
		this.deliverUpdate({
			type: 'objective',
			id: objective.id,
			data: objective
		});
	}

	deliverUpdate(update) {
		if (this.viewModels[update.type] && this.viewModels[update.type][update.id]) {
			this.viewModels[update.type][update.id].forEach(vm => {
				vm.assign(update.data);
			});
		}
	}
}

const instance = DataObserver.instance;

export default instance;
