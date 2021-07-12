const Discord = require('discord.js');

module.exports = {
	'name': 'select',
	'aliases': [
		'sel'
	],
	'run': function(msg, args) {
		const svrCfg = this.dscServersConfig.get(msg.guild.id);

		if(args.length < 2) {
			const invalidUsage = new Discord.MessageEmbed()
				.setTitle('Invalid usage')
				.setColor('#ff0000')
				.setDescription('You need to supply a server\'s ID as an argument. If you need a list, you can run `' + svrCfg.prefix + 'list`.');

			msg.channel.send(invalidUsage);
			return ;
		}

		const conns = this.vncServersConfig.servers;

		if(!conns[args[1]]) {
			const invalidUsage = new Discord.MessageEmbed()
				.setTitle('Invalid usage')
				.setColor('#ff0000')
				.setDescription('That server ID was not found. If you need a list, you can run `' + svrCfg.prefix + 'list`.');

			msg.channel.send(invalidUsage);
			return ;
		}

		const before = svrCfg.members[msg.author.id].activeVNC;

		if(args[1] === before) {
			const invalidUsage = new Discord.MessageEmbed()
				.setTitle('Already selected')
				.setColor('#ff0000')
				.setDescription('You already have selected ' + conns[before].name + '!');

			msg.channel.send(invalidUsage);
			return ;
		}

		const embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Select VNC Server')
			.setDescription('You have selected **' + conns[args[1]].name + '**.');

		svrCfg.members[msg.author.id].activeVNC = args[1];

		if(before) {
			embed.addField('Before', conns[before].name, true);
		}

		embed.addField(before ? 'After' : 'Active', conns[args[1]].name, true);

		msg.channel.send(embed);
	}
};