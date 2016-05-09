const JSSlave	= require('js-slave-base');
const chokidar	= require('charmeleon');
const fs		= require('fs');

/**
 * Represent the category "File" for jsbot-manager.
 */
class JSSlaveFile extends JSSlave {
	/**
	 * Create a JSSlaveFile and define events/actions.
	 */
	constructor() {
		super();
		this.watcher = null;

		this.categoryName = 'File';

		this.addEvent('File created', 'Trigger when a file is created', this.fileCreated, [
			{ name: 'path', description: 'The path where we have to watch for new created file', type: String }
		], [
			{ name: 'filename', description: 'The name of the new created file', type: String },
			{ name: 'path', description: 'The path where the file has been created', type: String }
		]);
	}

	/**
	 * Watch file creation inside a directory.
	 * @param  {ActionPointer} actionPointer - The pointer to the action.
	 * @param  {UserParameters} eventParameters - UserParameters that will be used by the event.
	 * @param  {UserParameters} actionParameters [description] - UserParameters that will be used by the action.
	 */
	fileCreated(actionPointer, eventParameters, actionParameters) {
		const path = eventParameters.get('path');

		try {
			fs.accessSync(path, fs.F_OK);
			if (this.watcher === null) {
				this.watcher = chokidar.watch('*', {
					cwd: path,
					persistent: true,
					ignoreInitial: true
				});

				this.watcher.on('add', (filename) => {
					actionParameters.matchParameters([
						{name: 'filename', value: filename},
						{name: 'path', value: path}
					]);
					actionPointer.start(actionParameters);
				});
				this.watcher.on('error', (error) => {
					console.log(error);
				});
			}
		} catch(e) {
			throw new JSSlave.JSSlaveError(e.message);
		}
	}

	/**
	 * Stop the watch of the directory by fileCreated.
	 * @param  {UserParameters} userParameters - The UserParameters sent to fileCreated.
	 * @return {Promise} Return a Promise.
	 */
	stopFileCreated(userParameters) {
		return new Promise((resolve) => {
			this.watcher.unwatch(userParameters.get('path'));
			resolve();
		});
	}
}

module.exports = JSSlaveFile;
