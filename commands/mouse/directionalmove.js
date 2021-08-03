const Discord = require('discord.js');

// used to execute screen send command
const sendScreen = require('../screen.js').run;

const directions = [
	'right',
	'down',
	'left',
	'up'
], aliases = directions.map(a => a[0]); 

const invalidUsage = new Discord.MessageEmbed()
	.setTitle('Invalid usage')
	.setColor('#ff0000')
	.setDescription('Not enough arguments specified. You need to specify both a direction and a distance value to move the mouse directionally.');

module.exports = {
	'aliases': directions.concat(aliases),
	'run': async function(msg, args) {
		if(args.length < 3) {
			msg.channel.send(invalidUsage);
			return ;
		}

		const svrInf = this.dscServersConfig.get(msg.guild.id);
		const vnc = svrInf.members[msg.author.id].activeVNC;

		// find the appropriate direction
		const direction = directions.find(dir => {
			if(args[1][0] === dir[0]) return dir;
		}), directionIndex = directions.indexOf(direction);

		// and calculate angle
		const angle = Math.PI / 2 * directions.indexOf(direction);
		// as well as magnitude
		const magnitude = Number.parseFloat(args[2]);

		// to calculate the movement
		const x = Math.cos(angle) * magnitude,
			y = Math.sin(angle) * magnitude;

		await this.vncServers[vnc].mouseMoveRelative(x, y);

		sendScreen.apply(this, [ msg ]);
	}
}