import TemplateElement from './template-element';
import template from './templates/scorepanel.tpl';
import {getMatchId, getMatch} from '../data/matches';
import {getWorlds} from '../data/worlds';
import Chart from 'chart.js';
import DefineMap from 'can-define/map/map';
import {registerViewModel} from '../data/data-observer';

export default class ScorePanel extends TemplateElement {
	initViewModel() {
		const Scores = DefineMap.extend(
			{seal: false},
			{
				world_names: {
					type: 'observable'
				},
				all_world_names: {
					type: 'observable'
				},
				income: {
					value: prop => {
						prop.listenTo('scores', function() {
							const income = {Red: 0, Blue: 0, Green: 0};
							this.maps.forEach(map => {
								['Red', 'Blue', 'Green'].forEach(color => {
									income[color] += map.objectives
										.filter(obj => obj.owner === color)
										.map(obj => obj.points_tick)
										.reduce((acc, curr) => acc + curr);
								});
							});
							prop.resolve(income);
						});
					}
				},
				scores: {
					type: 'observable'
				},
				currentScores: {
					value: prop => {
						prop.listenTo('scores', function() {
							const latestSkirmish = this.skirmishes.reduce((latest, current) => {
								if (latest) {
									return current.id > latest.id ? current : latest;
								}
								return current;
							});
							prop.resolve(latestSkirmish.scores);
						});
					}
				},
				victory_points: {
					type: 'observable'
				},
				victory_points_diff: {
					value: prop => {
						prop.listenTo('victory_points', function() {
							let points = [this.victory_points.red, this.victory_points.blue, this.victory_points.green];
							let maximum = points.reduce((max, cur) => Math.max(max, cur));
							prop.resolve({
								red: this.victory_points.red - maximum,
								blue: this.victory_points.blue - maximum,
								green: this.victory_points.green - maximum
							});
						});
					}
				},
				skirmishes: {type: 'observable'},
				maps: {type: 'observable'}
			}
		);
		return this.getViewModel().then(data => {
			this.viewModel = new Scores(data);
			registerViewModel(data.id, 'match', this.viewModel);
			return this.viewModel;
		});
	}

	getTemplate() {
		return template;
	}

	getViewModel() {
		return getWorlds().then(worlds => {
			return getMatch(getMatchId()).then(result => {
				return this.fillMatchData(worlds, result);
			});
		});
	}

	templateRendered() {
		const chartHandler = this.drawChart.bind(this);
		this.viewModel.on('income', chartHandler);
		this.addEventListener('click', this.openMatchesPanel);
	}

	openMatchesPanel() {
		document.querySelector('gw2-matchespanel').setAttribute('open', 'open');
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

	drawChart() {
		let income = this.viewModel.income;
		this.chartData = {
			datasets: [
				{
					data: [income.Blue, income.Green, income.Red],
					labels: ['Blue', 'Green', 'Red'],
					backgroundColor: ['#1a4da1', '#1e7b2d', '#b02822']
				}
			]
		};
		if (!this.chart) {
			let ctx = this.shadowRoot.querySelector('.chart').getContext('2d');
			this.chart = new Chart(ctx, {
				type: 'pie',
				data: this.chartData,
				options: {
					tooltips: {enabled: false},
					legend: {
						display: false
					}
				}
			});
		}
		else {
			this.chartData.datasets.data = [income.Blue, income.Green, income.Red];
			this.chart.update();
		}
		let rotate = income.Red / (income.Blue + income.Green + income.Red) / 2 * 360;
		this.shadowRoot.querySelector('.chart').style.transform = 'rotate(' + rotate + 'deg)';
	}
}

window.customElements.define('gw2-scorepanel', ScorePanel);
