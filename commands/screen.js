const Discord = require('discord.js');

module.exports = {
	'name': 'screen',
	'aliases': [
		'scr',
		's'
	],
	'run': async function(msg, args) {
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

		const screenshot = await this.vncServers[vnc].getScreenshot();
		const embed = new Discord.MessageEmbed()
			.setTitle(this.vncServersConfig.servers[vnc].name)
			.setColor(this.vncServersConfig.servers[vnc].color || '#000000')
			.attachFiles([
				new Discord.MessageAttachment(screenshot.toBuffer('image/png'), 'screenshot.png')
			])
			.setImage('attachment://screenshot.png');
		msg.channel.send(embed);
		msg.channel.stopTyping();
	}
};