<link rel="stylesheet" type="text/css" href="css/gw2-objective.css" />

{{#if context.type}}
	{{#if (context.type == "Castle")}}
	<link rel="stylesheet" type="text/css" href="css/obj-castle.css" /> {{/if}}
	{{#if (context.type == "Keep")}}
	<link rel="stylesheet" type="text/css" href="css/obj-keep.css" /> {{/if}}
	{{#if (context.type == "Tower")}}
	<link rel="stylesheet" type="text/css" href="css/obj-tower.css" /> {{/if}}
	{{#if (context.type == "Camp")}}
	<link rel="stylesheet" type="text/css" href="css/obj-camp.css" /> {{/if}}
	{{#if (context.type == "Ruins")}}
	<link rel="stylesheet" type="text/css" href="css/obj-ruins.css" /> {{/if}}
{{/if}}

<div class="objective {{=context.type}}" owner="{{=context.owner}}" tier="{{=context.tierInfo}}" {{#if context.claimed_at}}claimed{{/if}}>
	{{#if (context.type != "Ruins")}}
	<div class="iteminfos">
		<div class="turnedtext"></div>
		<div class="marker"></div>
		<div class="info_wrapper">
			<div class="info">
				<div class="guild_emblem"></div>
				<span class="name">{{=context.name}}</span>
				<span class="timer"></span>
				<span class="guildname">{{=context.guildInfo}}</span>
				<span class="claimed"></span>
				{{#if context.dolyakInfo}}<span class="dollies">{{=context.dolyakInfo}}</span>{{/if}}
				<span class="upgrades">
					<span class="upgrade"></span>
					<span class="upgrade"></span>
					<span class="upgrade"></span>
					<span class="upgrade"></span>
					<span class="upgrade"></span>
					<span class="upgrade"></span>
				</span>
			</div>
		</div>
	</div>
	{{/if}}
</div>
