const Discord = require('discord.js');

// used to execute screen send command
const sendScreen = require('../screen.js').run;

const actions = {
	'press': [ 1 ],
	'hold': 'press',

	'release': [ 0 ],
	'depress': 'release',

	'click': [ 1, 0 ],
	'c': 'click',

	'doubleclick': [ 1, 0, 1, 0 ],
	'dc': 'doubleclick',

	'rightclick': [ 4, 0 ],
	'rclick': 'rightclick',
	'rc': 'rclick',

	'middleclick': [ 2, 0 ],
	'mclick': 'middleclick',
	'mc': 'mclick'
};

module.exports = {
	'aliases': Object.keys(actions),
	'run': async function(msg, args) {
		if(args.length < 2) {
			msg.channel.send(invalidUsage);
			return ;
		}

		const svrInf = this.dscServersConfig.get(msg.guild.id);
		const vnc = svrInf.members[msg.author.id].activeVNC;

		// find the appropriate action list
		let action = actions[args[1]];
		while(action in actions) {
			action = actions[action];
		}

		for(let ix = 0; ix < action.length; ++ ix) {
			await this.vncServers[vnc].mouseStateSet(action[ix]);
		}

		sendScreen.apply(this, [ msg ]);
	}
}