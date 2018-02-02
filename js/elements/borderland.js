import * as objectives from "../data/objectives";
import TemplateElement from './template-element';
import template from './templates/gw2-borderland.dot';

export default class Borderland extends TemplateElement {

	getTemplate() {
		return template;
	}
	getTemplateData() {
		let that = this;
		return new Promise(function(resolve) {
			let elements = [];
			return objectives.getObjectives().then(_objs => {
				_objs.map(element => {
					if (element.map_type === that.id) {
						let position = objectives.getObjectivePosition(element);
						element.x = position[0];
						element.y = position[1];
						elements.push(element);
					}
				});
				resolve({maps: elements});
			});
		});
	}
}

window.customElements.define('gw2-borderland', Borderland);
