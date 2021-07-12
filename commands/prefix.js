const Discord = require('discord.js');

const emotes = [
	'\ud83d\udfe2', // green circle
	'\ud83d\udd34'  // red circle
];

// TODO: possibly move these into a collective map or object
const embed = new Discord.MessageEmbed()
	.setColor('#ff9900')
	.setTitle('Prefix change')
	.setDescription('React with ' + emotes[0] + ' to confirm this change.');

const timedOut = new Discord.MessageEmbed()
	.setTitle('Prefix change')
	.setColor('#ff0000')
	.setDescription('Requested prefix change has timed out due to a lack of a response.');

const cancelled = new Discord.MessageEmbed()
	.setTitle('Prefix change')
	.setColor('#cccc00')
	.setDescription('Requested prefix change has been cancelled.');

const changed = new Discord.MessageEmbed()
	.setTitle('Prefix change')
	.setColor('#00ff33')
	.setDescription('The prefix has been changed successfully.');

const invalidUsage = new Discord.MessageEmbed()
	.setTitle('Invalid usage')
	.setColor('#ff0000')
	.setDescription('You need to supply a new prefix as an argument.');

module.exports = {
	'name': 'prefix',
	'aliases': [
		'pre'
	],
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

		const svrCfg = this.dscServersConfig.get(msg.guild.id);

		const msgSent = await msg.channel.send(embed);

		await msgSent.react(emotes[0]);
		await msgSent.react(emotes[1]);

		try {
			const resp = await msgSent.awaitReactions((reaction, user) => {
				if(user.id !== msg.author.id) return false;
				return emotes.includes((reaction.emoji.name || ''));
			}, { max: 1, time: 30000, errors: [ 'time' ] });

			if(emotes.indexOf(resp.first().emoji.name) === 0) {
				svrCfg.prefix = args[1];
				msgSent.edit(changed);
			} else {
				msgSent.edit(cancelled);
			}
		} catch(er) {
			msgSent.edit(timedOut);
		}

		msgSent.reactions.removeAll();
	}
};