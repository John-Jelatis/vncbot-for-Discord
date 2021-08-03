const fs = require('fs');
const Discord = require('discord.js');

// used to execute screen send command
const sendScreen = require('./screen.js').run;

// subcommands
const subcommands = new Discord.Collection();

const invalidUsage = new Discord.MessageEmbed()
	.setTitle('Invalid usage')
	.setColor('#ff0000')
	.setDescription('Not enough arguments specified. Run with argument `help` to get a list of valid subcommands to use.');

module.exports = {
	'name': 'mouse',
	'aliases': [
		'm'
	],
	'run': async function(msg, args) {
		if(args.length < 2) {
			msg.channel.send(invalidUsage);
			return ;
		}

		const svrInf = this.dscServersConfig.get(msg.guild.id);

		const subcommand = subcommands.get(args[1]);
		if(!subcommand) {
			const invalidUsage = new Discord.MessageEmbed()
				.setTitle('Invalid usage')
				.setColor('#ff0000')
				.setDescription('Unknown subcommand specified. Run with argument `help` to get a list of valid subcommands to use.');

			msg.channel.send(invalidUsage);
			return ;
		}

		await subcommand.run.apply(this, [ msg, args ]);
	}
};

fs
	.readdirSync('./commands/mouse/')
	.filter(file => file.endsWith('.js'))
	.forEach(file => {
		const subcommand = require('./mouse/' + file);

		if(subcommand.name) {
			subcommands.set(subcommand.name, subcommand);
		}

		if(subcommand.aliases) {
			subcommand.aliases.forEach(alias => {
				subcommands.set(alias, subcommand);
			});
		}
	});