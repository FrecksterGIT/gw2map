import Promise from "bluebird";
import TemplateElement from "./template-element";
import template from "./templates/gw2-borderland.tpl";
import {getObjectives, getObjectivePosition} from "../data/objectives";
import DefineList from "can-define/list/list";

export default class Borderland extends TemplateElement {
	getTemplate() {
		return template;
	}
	initViewModel() {
		const BorderlandVM = new DefineList();
		let that = this;
		return new Promise(function(resolve) {
			return getObjectives().then(_objs => {
				_objs.map(element => {
					if (element.map_type === that.id) {
						let position = getObjectivePosition(element);
						element.x = position[0];
						element.y = position[1];
						BorderlandVM.push(element);
					}
				});
				resolve(BorderlandVM);
			});
		});
	}
}

window.customElements.define("gw2-borderland", Borderland);
