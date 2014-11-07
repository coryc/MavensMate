/* new_metadata commander component
 * To use add require('../cmds/new-metadata.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

var util 									= require('../util').instance;
var Metadata 							= require('../metadata');
var Deploy 								= require('../deploy');
var inherits 							= require('inherits');
var BaseCommand 					= require('../command');

function Command() {
	Command.super_.call(this, Array.prototype.slice.call(arguments, 0));
}

inherits(Command, BaseCommand);

Command.prototype.execute = function() {
	var self = this;
	
	var project = self.getProject();
	// TODO: add to local store
	var newMetadata = new Metadata(self.payload);
	var deploy = new Deploy({ project: project });
	return deploy.execute(newMetadata)
		.then(function(result) {
			self.respond(result);
		})
		['catch'](function(error) {
			self.respond('Could not create metadata', false, error);
		})
		.done();	
};

exports.command = Command;
exports.addSubCommand = function(client) {
	client.program
		.command('new-metadata')
		.version('0.0.1')
		.description('Creates new metadata based on supplied template and params')
		.action(function() {
			util.getPayload()
				.then(function(payload) {
					client.executeCommand(this._name, payload);	
				});	
		});
};