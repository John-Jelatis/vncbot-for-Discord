module.exports = {
	'name': 'error',
	'run': function() {
		console.error('A fatal error has occured. As such, the bot will now shutdown.');
		process.exit(1);
	}
};