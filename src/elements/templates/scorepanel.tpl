<link rel="stylesheet" type="text/css" href="css/scorepanel.css" />
<table data-match-id="{{=context.id}}">
	<thead>
		<tr class="header">
			<td class="worlds">World</td>
			<td class="income">Income</td>
			<td class="current_score">Score</td>
			<td rowspan="4" class="chart_container">
				<canvas class="chart" width="64" height="64" style="float: left; width: 64px; height: 64px;"></canvas>
			</td>
			<td class="victory_points" colspan="3">Victory Points</td>
			<td></td>
		</tr>
	</thead>
	<tbody>
		<tr class="green_world">
			<td class="name">{{=context.world_names.green}}
				<span>{{=context.all_world_names.green}}</span>
			</td>
			<td class="income">{{=context.income.Green}}</td>
			<td class="current_score">{{=context.currentScores.green}}</td>
			<td class="victory_points" colspan="2">{{=context.victory_points.green}}</td>
			<td class="diff">{{=context.victory_points_diff.green}}</td>
			<td class="bar">
				<div>
					<div style="width: 100%;"></div>
				</div>
			</td>
		</tr>
		<tr class="blue_world">
			<td class="name">{{=context.world_names.blue}}
				<span>{{=context.all_world_names.blue}}</span>
			</td>
			<td class="income">{{=context.income.Blue}}</td>
			<td class="current_score">{{=context.currentScores.blue}}</td>
			<td class="victory_points" colspan="2">{{=context.victory_points.blue}}</td>
			<td class="diff">{{=context.victory_points_diff.blue}}</td>
			<td class="bar">
				<div>
					<div style="width: 100%;"></div>
				</div>
			</td>
		</tr>
		<tr class="red_world">
			<td class="name">{{=context.world_names.red}}
				<span>{{=context.all_world_names.red}}</span>
			</td>
			<td class="income">{{=context.income.Red}}</td>
			<td class="current_score">{{=context.currentScores.red}}</td>
			<td class="victory_points" colspan="2">{{=context.victory_points.red}}</td>
			<td class="diff">{{=context.victory_points_diff.red}}</td>
			<td class="bar">
				<div>
					<div style="width: 100%;"></div>
				</div>
			</td>
		</tr>
	</tbody>
</table>
