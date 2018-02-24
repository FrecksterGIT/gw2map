const viewModels = {};

const registerViewModel = (id, type, viewModel) => {
	if (!viewModels[type]) {
		viewModels[type] = {};
	}

	if (viewModels[type][id]) {
		viewModels[type][id].push(viewModel);
	}
	else {
		viewModels[type][id] = [viewModel];
	}
};

const deliverUpdate = update => {
	if (viewModels[update.type] && viewModels[update.type][update.id]) {
		viewModels[update.type][update.id].forEach(vm => {
			vm.assign(update.data);
		});
	}
};

const updateAllData = data => {
	deliverUpdate({
		type: 'match',
		id: data.id,
		data: data
	});
	data.maps.forEach(map => {
		map.objectives.forEach(objective => {
			objective.map_id = map.id;
			objective.map_type = map.type;
			objective.match_worlds = data.worlds;
			deliverUpdate({
				type: 'objective',
				id: objective.id,
				data: objective
			});
		});
	});
};

export {registerViewModel, updateAllData};
