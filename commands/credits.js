const Discord = require('discord.js');
const package = require('../package.json');

const urlSpl = package.repository.url
	.split('/')
	.filter(a => a.length);

const embed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle(package.name)
	.setURL(package.repository.url)
	.setDescription(package.description)
	.addFields(
		{
			'name': 'Version',
			'value': package.version,
			'inline': true
		},
		{
			'name': 'Repo',
			'value': urlSpl.slice(-2).join('/'),
			'inline': true
		}
	);

if(package.repository.url.indexOf('github') >= 0) {
	embed.setAuthor(package.author, 'https://github.com/' + urlSpl.slice(-2, -1) + '.png?size=200', 'https://github.com/' + urlSpl.slice(-2, -1));
} else {
	embed.setAuthor(package.author);
}

if(package.author.indexOf('John Jelatis') < 0) {
	embed
		.setFooter('originally written by John-Jelatis');
}

module.exports = {
	'name': 'credits',
	'aliases': [
		'source', 'src'
	],
	'run': function(msg) {
		msg.channel.send(embed);
	}
};