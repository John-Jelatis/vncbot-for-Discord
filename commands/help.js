const Discord = require('discord.js');

const str = [ ], added = [ ];

module.exports = {
	'name': 'help',
	'desc': 'Print list of bot\'s commands.',
	'run': async function(msg, args) {
		const helpUsage = new Discord.MessageEmbed()
			.setTitle('Help')
			.setColor('#ff9900');

		helpUsage.setDescription('**Commands**:\n\n' + str
			.filter(a => {
				return (!a.hasPermission) || a.hasPermission(msg);
			})
			.map(a => {
				return '**' + a.name + '**\n  ' + a.desc;
			})
			.join('\n')
		);
		msg.channel.send(helpUsage);
	},
	'setup': async function(client) {
		client.commands.forEach((cmd, key) => {
			if(added.indexOf(cmd.name) >= 0) return ;

			added.push(cmd.name);
			str.push(cmd);
		});
	}
}