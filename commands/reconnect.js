const Discord = require('discord.js');

const invalidUsage = new Discord.MessageEmbed()
	.setTitle('Invalid usage')
	.setColor('#ff0000')
	.setDescription('You need to supply a connection to reconnect as an argument.');

module.exports = {
	'name': 'reconnect',
	'aliases': [
		'refresh'
	],
	'desc': '[*ADMIN* or *VNCBot Manager*] Force reconnect VM.',
	'hasPermission': function(msg) {
		// assume no permission
		let hasPermission = false;

		// but if they have the role
		hasPermission = hasPermission || msg.member.roles.cache.some(r => (r.name === 'VNCBot Manager'));

		// or administration permissions
		hasPermission = hasPermission || msg.member.hasPermission('ADMINISTRATOR');
		hasPermission = hasPermission || msg.member.hasPermission('MANAGE_GUILD');

		// then just let them
		return hasPermission;
	},
	'run': async function(msg, args) {
		if(args.length < 2) {
			msg.channel.send(invalidUsage);
			return ;
		}

		const reconnected = [ ],
			failed = [ ];

		args
			.slice(1) // remove command name
			.forEach(vnc => {
				if(this.vncServers[vnc]) {
					try {
						const conn = this.vncServers[vnc].conn;
						if(conn) conn.close();
					} catch(er) {
						// must be fully dead
					}

					this.vncServers[vnc].connect();
					reconnected.push(vnc);
				} else {
					failed.push(vnc);
				}
			});

		const embed = new Discord.MessageEmbed()
			.setTitle('Reconnected Servers')
			.setColor('#0099ff')
			.setDescription('with a(n) ' + Math.round(100 * reconnected.length / (args.length - 1)) + '% success rate.');

		if(reconnected.length) {
			embed.addField('Successes', reconnected.length, true);
		}

		if(failed.length) {
			embed.addField('Failures', reconnected.length, true);
			embed.setFooter('Ensure the following IDs are valid: ' + failed.map(a => {
				return '`' + a + '`'
			}).join(', '));
		}
	}
};