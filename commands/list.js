const Discord = require('discord.js');

module.exports = {
	'name': 'list',
	'aliases': [
		'list-connections',
		'list-desktops',
		'lis'
	],
	'run': function(msg) {
		const conns = Object.entries(this.vncServersConfig.servers);

		const embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Available Remote Desktops')
			.setDescription('Select one with `' + this.dscServersConfig.get(msg.guild.id).prefix + 'select [id]`.')
			.addFields(
				...conns.map(conn => {
					return {
						'name': '**' + conn[1].name + '** [' + conn[0] + ']',
						'value': conn[1].desc || '*no description provided*'
					}
				})
			);


		msg.channel.send(embed);
	}
};