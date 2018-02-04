import TemplateElement from "./template-element";
import template from "./templates/scorepanel.dot";
import {getMatchId, getMatch} from "../data/matches";
import {getWorlds} from "../data/worlds";
import Chart from "chart.js";

export default class ScorePanel extends TemplateElement {
	getTemplate() {
		return template;
	}

	getTemplateData() {
		return getWorlds().then(worlds => {
			return getMatch(getMatchId()).then(result => {
				return this.fillMatchData(worlds, result);
			});
		});
	}

	templateRendered(data) {
		this.redraw({data: {changedData: data}});
		let changeEventHandler = this.redraw.bind(this);
		window.addEventListener("gw2scoreboard", changeEventHandler);
	}

	fillMatchData(worlds, match) {
		let filledMatch = match;
		filledMatch.currentScores = this.getCurrentScores(match);
		filledMatch.income = this.getIncome(match);
		filledMatch.victory_points_diff = this.getVictoryPointDiffs(match);
		filledMatch = this.setWorldNamesForMatch(worlds, match);
		return filledMatch;
	}

	getVictoryPointDiffs(match) {
		return {
			red: this.getVictoryPointDiff("red", match.victory_points),
			blue: this.getVictoryPointDiff("blue", match.victory_points),
			green: this.getVictoryPointDiff("green", match.victory_points)
		};
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
				.join(", "),
			blue: match.all_worlds.blue
				.filter(item => item !== match.worlds.blue)
				.map(world => worlds[world].name)
				.join(", "),
			green: match.all_worlds.green
				.filter(item => item !== match.worlds.green)
				.map(world => worlds[world].name)
				.join(", ")
		};
		return match;
	}

	redraw(changedDataEvent) {
		getWorlds().then(worlds => {
			let data = this.fillMatchData(worlds, changedDataEvent.data.changedData);
			let table = this.shadowRoot.querySelector('table');
			this.fillTable(table, data);
		});
	}

	fillTable(table, data) {
		if (table) {
			table.classList.add("active");
			table.querySelector(".green_world .current_score").innerHTML = data.currentScores.green;
			table.querySelector(".blue_world .current_score").innerHTML = data.currentScores.blue;
			table.querySelector(".red_world .current_score").innerHTML = data.currentScores.red;
			table.querySelector(".green_world .income").innerHTML = data.income.Green;
			table.querySelector(".blue_world .income").innerHTML = data.income.Blue;
			table.querySelector(".red_world .income").innerHTML = data.income.Red;
			table.querySelector(".green_world .victory_points").innerHTML = data.victory_points.green;
			table.querySelector(".green_world .diff").innerHTML = data.victory_points_diff.green;
			table.querySelector(".blue_world .victory_points").innerHTML = data.victory_points.blue;
			table.querySelector(".blue_world .diff").innerHTML = data.victory_points_diff.blue;
			table.querySelector(".red_world .victory_points").innerHTML = data.victory_points.red;
			table.querySelector(".red_world .diff").innerHTML = data.victory_points_diff.red;
			this.drawChart(table, data);
		}
	}

	getVictoryPointDiff(color, all_points) {
		let points = [all_points.red, all_points.blue, all_points.green];
		let maximum = points.reduce((max, cur) => Math.max(max, cur));
		return all_points[color] - maximum;
	}

	getCurrentScores(match) {
		let skirmish = match.skirmishes.reduce((latest, current) => {
			if (latest) {
				return current.id > latest.id ? current : latest;
			}
			return current;
		});
		return skirmish.scores;
	}

	getIncome(match) {
		let income = {Red: 0, Blue: 0, Green: 0};
		match.maps.forEach(map => {
			["Red", "Blue", "Green"].forEach(color => {
				income[color] += map.objectives
					.filter(obj => obj.owner === color)
					.map(obj => obj.points_tick)
					.reduce((acc, curr) => acc + curr);
			});
		});
		return income;
	}

	drawChart(table, match) {
		let income = this.getIncome(match);
		this.chartData = {
			datasets: [
				{
					data: [income.Blue, income.Green, income.Red],
					labels: ["Blue", "Green", "Red"],
					backgroundColor: ["#1a4da1", "#1e7b2d", "#b02822"]
				}
			]
		};
		if (!this.chart) {
			let ctx = table.querySelector(".chart").getContext("2d");
			this.chart = new Chart(ctx, {
				type: "pie",
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
		table.querySelector(".chart").style.transform = "rotate(" + rotate + "deg)";
	}
}

window.customElements.define("gw2-scorepanel", ScorePanel);
