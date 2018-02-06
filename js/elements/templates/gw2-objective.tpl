<link rel="stylesheet" type="text/css" href="css/gw2-objective.css" />

{{#if context.type}}
	{{#is (context.type, "Castle")}}
	<link rel="stylesheet" type="text/css" href="css/obj-castle.css" /> {{/is}}
	{{#is (context.type, "Keep")}}
	<link rel="stylesheet" type="text/css" href="css/obj-keep.css" /> {{/is}}
	{{#is (context.type, "Tower")}}
	<link rel="stylesheet" type="text/css" href="css/obj-tower.css" /> {{/is}}
	{{#is (context.type, "Camp")}}
	<link rel="stylesheet" type="text/css" href="css/obj-camp.css" /> {{/is}}
	{{#is (context.type, "Ruins")}}
	<link rel="stylesheet" type="text/css" href="css/obj-ruins.css" /> {{/is}}
{{/if}}

<div class="objective {{=context.type}}" owner="{{=context.owner}}" tier="{{=context.tierInfo}}" {{#if context.claimed_at}}claimed{{/if}}>
	{{#is (context.type, "Ruins")}}
	{{else}}
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
	{{/is}}
</div>
