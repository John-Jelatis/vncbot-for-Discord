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
	'name': 'type',
	'aliases': [
		't'
	],
	'desc': 'Press keys as to type a string of text.',
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

		const keysRaw = msg.content
			.split(args[0] + ' ') // split on prefix
			.slice(1) // remove first entry
			.join(args[0] + ' '); // join back, in case of instances where message includes prefix

		const keys = Array.from(keysRaw)
			.map(a => {
				return keymap[a];
			})
			.filter(a => !!a);

		msg.channel.startTyping();
		for(let ix = 0; ix < keys.length; ++ ix) {
			if(keys[ix][1]) {
				await this.vncServers[vnc].pressKey(keymap['shift'][0], 1);
			}

			await this.vncServers[vnc].pressKey(keys[ix][0], 1);

			if(keys[ix][1]) {
				await this.vncServers[vnc].pressKey(keymap['shift'][0], 0);
			}

			await this.vncServers[vnc].pressKey(keys[ix][0], 0);
		}

		msg.channel.stopTyping();
		sendScreen.apply(this, [ msg ]);
	}
};