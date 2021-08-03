const Discord = require('discord.js');

// used to execute screen send command
const sendScreen = require('../screen.js').run;

const commands = [
	'right', 'down', 'left', 'up',

	'relative', 'absolute',

	'click', 'doubleclick', 'rightclick', 'middleclick'
];

const helpUsage = new Discord.MessageEmbed()
	.setTitle('Help')
	.setColor('#ff9900')
	.setDescription('Available commands consist of: \n  ' + commands.map(a => {
		return '`' + a + '`';
	}).join('\n  '));

module.exports = {
	'name': 'help',
	'run': async function(msg, args) {
		msg.channel.send(helpUsage);
	}
}