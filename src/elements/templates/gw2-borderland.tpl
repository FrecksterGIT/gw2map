<link rel="stylesheet" type="text/css" href="css/gw2-borderland.css" />
{{#if context}}
	{{#each(context, element=value)}}
		<gw2-objective id="{{{element.id}}" type="{{{element.type}}" name="{{{element.name}}" style="left: {{{element.x}}%; top:{{{element.y}}%"></gw2-objective>
	{{/each}}
{{/if}}
