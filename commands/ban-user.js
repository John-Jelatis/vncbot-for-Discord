const Discord = require('discord.js');

const str = [ ], added = [ ];

const invalidUsage = new Discord.MessageEmbed()
	.setTitle('Ban user')
	.setColor('#ff0000')
	.setDescription('You need to mention a user to ban from the bot');

const alreadyDone = new Discord.MessageEmbed()
	.setTitle('Unbanned user')
	.setColor('#ff0000')
	.setDescription('User already has been banned!');

module.exports = {
	'name': 'ban-user',
	'aliases': [ 'ban', 'block' ],
	'desc': 'Ban users from using the bot.',
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
		const user = msg.mentions.users.first();

		if(!user) {
			msg.channel.send(invalidUsage);
			return ;
		}

		const svrInf = this.dscServersConfig.get(msg.guild.id);

		if(svrInf.banned.indexOf(user.id) >= 0) {
			msg.channel.send(alreadyDone);
			return ;
		}

		svrInf.banned.push(user.id);

		const userBanned = new Discord.MessageEmbed()
			.setTitle('User banned')
			.setColor('#ff9900')
			.setDescription('Banned `' + user.username + '#' + user.discriminator + '` from using the bot.');

		msg.channel.send(userBanned);
	}
}