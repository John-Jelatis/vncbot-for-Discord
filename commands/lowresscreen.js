const Discord = require('discord.js');
const canvas = require('canvas');

const invalidUsage = new Discord.MessageEmbed()
	.setTitle('Invalid usage')
	.setColor('#ff0000')
	.setDescription('You need to specify how low of a resolution you want (lscr [wid] [hei]).');

// This is probably temporary, however I find it to be useful
// I might make this a user-configurable mode, such that they can set a 
// max screenres sent as a reply to their messages... who knows?
module.exports = {
	'name': 'lscr',
	'aliases': [ ],
	'run': async function(msg, args) {
		if(args.length < 3) {
			msg.channel.send(invalidUsage);
			return ;
		}

		msg.channel.startTyping();

		const svrInf = this.dscServersConfig.get(msg.guild.id);

		const vnc = svrInf.members[msg.author.id].activeVNC;

		if(!this.vncServers[vnc]) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Error requesting screengrab')
				.setDescription('The server `' + vnc + '` could not be found.')
				.setColor('#ff0000');
			msg.channel.send(embed);
			msg.channel.stopTyping();
			return ;
		}

		const fullsize = await this.vncServers[vnc].getScreenshot();

		const smallshot = canvas.createCanvas(Number.parseInt(args[1]), Number.parseInt(args[2]));
		const context = smallshot.getContext('2d');
		context.imageSmoothingEnabled = false;
		context.drawImage(fullsize, 0, 0, smallshot.width, smallshot.height);

		const embed = new Discord.MessageEmbed()
			.setTitle(this.vncServersConfig.servers[vnc].name + ' [low-res]')
			.setColor(this.vncServersConfig.servers[vnc].color || '#000000')
			.setDescription('Note: this feature is subject to removal, and is only a quick hack. Don\'t rely on it\'s longevity.')
			.attachFiles([
				new Discord.MessageAttachment(smallshot.toBuffer('image/png'), 'lowres.png')
			])
			.setImage('attachment://lowres.png');
		msg.channel.send(embed);
		msg.channel.stopTyping();
	}
};