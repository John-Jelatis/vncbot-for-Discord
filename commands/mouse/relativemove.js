const Discord = require('discord.js');

// used to execute screen send command
const sendScreen = require('../screen.js').run;

const invalidUsage = new Discord.MessageEmbed()
	.setTitle('Invalid usage')
	.setColor('#ff0000')
	.setDescription('Not enough arguments specified. You need to specify both an X and a Y coordinate modifier to move the mouse relatively.');

module.exports = {
	'name': 'relative',
	'aliases': [ 'rel', 'rl' ],
	'run': async function(msg, args) {
		if(args.length < 4) {
			msg.channel.send(invalidUsage);
			return ;
		}

		const svrInf = this.dscServersConfig.get(msg.guild.id);
		const vnc = svrInf.members[msg.author.id].activeVNC;

		// parse the movement
		const x = Number.parseInt(args[2]),
			y = Number.parseInt(args[3]);

		await this.vncServers[vnc].mouseMoveRelative(x, y);

		sendScreen.apply(this, [ msg ]);
	}
}