const Discord = require('discord.js');
const noPerms = new Discord.MessageEmbed()
	.setColor('#ff0000')
	.setTitle('Command Unavailable')
	.setDescription('You do not have permission to perform that action.');

module.exports = {
	'name': 'message',
	'run': function(msg) {
		// prevent indefinite spam
		if(msg.author.id == this.user.id) {
			return ;
		}

		// dm channels
		if(!msg.guild) {
			msg.channel.send('Did you just slide into my DMs expecting me to enslave myself on your behalf? Go back to the server you found me in, my friend.');
			return ;
		}

		// load server-specific settings
		if(!this.dscServersConfig.has(msg.guild.id)) {
			this.dscServersConfig.set(msg.guild.id, {
				'prefix': '!',
				'defaultServer': this.vncServersConfig.defaultServer || Object.keys(this.vncServersConfig.servers)[0],
				'members': { }
			});
		}

		let svrCfg = this.dscServersConfig.get(msg.guild.id);

		// only run commands
		if(!msg.content || !msg.content.startsWith(svrCfg.prefix)) return ;

		// ey, you there
		if(msg.author.bot) {
			msg.reply('Get yo\' mechanical ass outta here!');
			return ;
		}

		// user defaults
		if(!svrCfg.members[msg.author.id]) {
			svrCfg.members[msg.author.id] = {
				'activeVNC': svrCfg.defaultServer
			};
		}

		// evaluate command
		const args = msg.content
			.slice(svrCfg.prefix.length)
			.trim()
			.split(/ +/);

		// find & execute command
		const command = this.commands.get(args[0]);
		if(command) {
			if(command.hasPermission && !command.hasPermission(msg)) {
				msg.channel.send(noPerms);
				return ;
			}

			command.run.apply(this, [ msg, args ]);
		}
	}
};