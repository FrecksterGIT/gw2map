<link rel="stylesheet" type="text/css" href="css/notifications.css" />
<div class="notifications">
	{{#each(context, notification=value)}}
	<div class="notification {{{=notification.type}}">{{{=notification.date}} {{{=notification.message}}</div>
	{{/each}}
</div>
