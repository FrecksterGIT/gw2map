import TemplateElement from './template-element';
import template from './templates/matchespanel.tpl';
import {getWorlds} from '../data/worlds';
import DefineMap from 'can-define/map/map';
import {getMatches, setMatchId, stopMatchUpdates, initMatchUpdates} from '../data/matches';

export default class MatchesPanel extends TemplateElement {
	static get observedAttributes() {
		return ['open'];
	}

	initViewModel() {
		const MatchesVM = DefineMap.extend(
			{seal: false},
			{
				matches: {
					type: 'observable'
				}
			}
		);
		return this.getViewModel().then(data => {
			this.viewModel = new MatchesVM(data);
			return this.viewModel;
		});
	}

	getTemplate() {
		return template;
	}

	getViewModel() {
		return getWorlds().then(worlds => {
			return getMatches().then(matches => {
				const filledMatches = matches.map(match => {
					let m = this.fillMatchData(worlds, match);
					return {
						id: m.id,
						world_names: m.world_names,
						all_world_names: m.all_world_names
					};
				});
				return {
					matches: {
						eu: filledMatches.filter(match => match.id.startsWith('2-')),
						us: filledMatches.filter(match => match.id.startsWith('1-'))
					}
				};
			});
		});
	}

	templateRendered() {
		this.shadowRoot.querySelector('.matches').addEventListener('click', clickEvent => this.closeMatchesSelector(clickEvent));
	}

	closeMatchesSelector(clickEvent) {
		const matchClicked = clickEvent.target.closest('.match');
		if (!!matchClicked) {
			stopMatchUpdates();
			this.switchActiveMatch(matchClicked.getAttribute('data-match-id'));
			document.querySelector('gw2-scorepanel').outerHTML = '<gw2-scorepanel></gw2-scorepanel>';
			document.querySelector('gw2-notifications').clearNotifications();
			initMatchUpdates();
		}
		this.removeAttribute('open');
	}
	switchActiveMatch(matchId) {
		setMatchId(matchId);
	}

	fillMatchData(worlds, match) {
		let filledMatch = match;
		filledMatch = this.setWorldNamesForMatch(worlds, match);
		return filledMatch;
	}

	setWorldNamesForMatch(worlds, match) {
		match.world_names = {
			red: worlds[match.worlds.red].name,
			blue: worlds[match.worlds.blue].name,
			green: worlds[match.worlds.green].name
		};
		match.all_world_names = {
			red: match.all_worlds.red
				.filter(item => item !== match.worlds.red)
				.map(world => worlds[world].name)
				.join(', '),
			blue: match.all_worlds.blue
				.filter(item => item !== match.worlds.blue)
				.map(world => worlds[world].name)
				.join(', '),
			green: match.all_worlds.green
				.filter(item => item !== match.worlds.green)
				.map(world => worlds[world].name)
				.join(', ')
		};
		return match;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		const table = this.shadowRoot.querySelector('.matches');
		if (name === 'open') {
			if (newValue === 'open') {
				table.classList.add('open');
			}
			else {
				table.classList.remove('open');
			}
		}
	}
}

window.customElements.define('gw2-matchespanel', MatchesPanel);
