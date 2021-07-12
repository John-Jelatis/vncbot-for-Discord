const Discord = require('discord.js');

// used to execute screen send command
const sendScreen = require('./screen.js').run;
// keymap
const keymap = require('../config/keymap.json');

const invalidUsage = new Discord.MessageEmbed()
	.setTitle('Invalid usage')
	.setColor('#ff0000')
	.setDescription('You need to specify keys to press.');

module.exports = {
	'name': 'press',
	'aliases': [
		'p'
	],
	'run': async function(msg, args) {
		if(args.length < 2) {
			msg.channel.send(invalidUsage);
			return ;
		}

		const svrInf = this.dscServersConfig.get(msg.guild.id);

		const vnc = svrInf.members[msg.author.id].activeVNC;

		const k = 'key' + (args.length > 2 ? 's' : '');

		if(!this.vncServers[vnc]) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Error sending ' + k + '!')
				.setDescription('The server `' + vnc + '` could not be found.')
				.setColor('#ff0000');
			msg.channel.send(embed);
			return ;
		}

		const keys = [ ],
			keysNotFound = [ ];
		for(let ix = 1; ix < args.length; ++ ix) {
			if(args[ix] in keymap) {
				keys.push(keymap[args[ix]]);
			} else {
				keysNotFound.push(args[ix]);
			}
		}

		if(keysNotFound.length !== 0) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Error sending ' + k + '!')
				.setDescription('Could not find the following ' + k + ': ' + keysNotFound.map(a => {
					if(a === '`') {
						return '`` ` ``';
					}

					return '`' + a + '`';
				}).join(', '))
				.setColor('#ff0000');
			msg.channel.send(embed);
			return ;
		}

		msg.channel.startTyping();
		for(let ix = 0; ix < keys.length; ++ ix) {
			if(keys[ix][1]) {
				await this.vncServers[vnc].pressKey(keymap['shift'][0], 1);
			}

			await this.vncServers[vnc].pressKey(keys[ix][0], 1);

			if(keys[ix][1]) {
				await this.vncServers[vnc].pressKey(keymap['shift'][0], 0);
			}
		}

		for(let ix = 0; ix < keys.length; ++ ix) {
			await this.vncServers[vnc].pressKey(keys[ix][0], 0);
		}

		msg.channel.stopTyping();
		sendScreen.apply(this, [ msg ]);
	}
};