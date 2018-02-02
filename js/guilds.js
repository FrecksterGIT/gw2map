const guilds = {};

const getGuild = (guildId) => {
	if (guilds[guildId]) {
		return Promise.resolve(guilds[guildId]);
	}
	else {
		return fetch("https://api.guildwars2.com/v1/guild_details.json?guild_id=" + guildId).then(response => {
			return response.json().then(guildData => {
				guilds[guildId] = guildData;
				return guilds[guildId];
			});
		});
	}
};

export {getGuild};
