import TemplateElement from './template-element';
import template from './templates/gw2-map.tpl';

export default class GW2Map extends TemplateElement {
	getTemplate() {
		return template;
	}
}

window.customElements.define('gw2-map', GW2Map);
