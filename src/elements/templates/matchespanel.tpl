<link rel="stylesheet" type="text/css" href="css/matchespanel.css" />
<div class="matches">
	<div class="matches--eu">
		{{#if context.matches.eu}} {{#each(context.matches.eu, match=value)}}
		<div class="match" data-match-id="{{=match.id}}">
			<span class="counter">{{@index + 1}}</span>
			<p class="name green">{{=match.world_names.green}}
				<span>{{=match.all_world_names.green}}</span>
			</p>
			<p class="name blue">{{=match.world_names.blue}}
				<span>{{=match.all_world_names.blue}}</span>
			</p>
			<p class="name red">{{=match.world_names.red}}
				<span>{{=match.all_world_names.red}}</span>
			</p>
		</div>
		{{/each}} {{/if}}
	</div>
	<div class="matches--us">
		{{#if context.matches.us}} {{#each(context.matches.us, match=value)}}
		<div class="match" data-match-id="{{=match.id}}">
			<span class="counter">{{@index + 1}}</span>
			<p class="name green">{{=match.world_names.green}}
				<span>{{=match.all_world_names.green}}</span>
			</p>
			<p class="name blue">{{=match.world_names.blue}}
				<span>{{=match.all_world_names.blue}}</span>
			</p>
			<p class="name red">{{=match.world_names.red}}
				<span>{{=match.all_world_names.red}}</span>
			</p>
		</div>
		{{/each}} {{/if}}
	</div>
</div>
