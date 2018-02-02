export default class TemplateElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}
	connectedCallback() {
		this.renderTemplate();
	}
	getTemplate() {
		throw new Error('need to specify a template');
	}
	getTemplateData() {
		return Promise.resolve({});
	}
	renderTemplate() {
		let template = this.getTemplate();
		let elm = document.createElement('div');
		this.getTemplateData().then(data => {
			elm.innerHTML = template(data);
			this.shadowRoot.appendChild(elm.cloneNode(true));
		});
	}
}
