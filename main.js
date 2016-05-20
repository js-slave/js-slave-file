const JSSlave	= require('js-slave-base');
const chokidar	= require('charmeleon');
const fs		= require('fs');

/**
 * Represent the category "File" for js-slave-manager.
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

		this.addEvent('File modified', 'Trigger when a file is modified', this.fileModified, [
			{ name: 'path', description: 'The path where we have to watch for modified file', type: String }
		], [
			{ name: 'filename', description: 'The name of the modified file', type: String },
			{ name: 'path', description: 'The path where the file has been modified', type: String }
		]);
	}

	/**
	 * Initialize the watcher.
	 * @param {String/Array} paths - Paths to files.
	 * @param {object} options [description]
	 */
	initWatcher(paths, options) {
		if (this.watcher === null) {
			this.watcher = chokidar.watch(paths, options);
		}
	}

	/**
	 * Watch file creation inside a directory.
	 * @param  {ActionPointer} actionPointer - The pointer to the action.
	 * @param  {UserParameters} eventParameters - UserParameters that will be used by the event.
	 * @param  {UserParameters} actionParameters - UserParameters that will be used by the action.
	 */
	fileCreated(actionPointer, eventParameters, actionParameters) {
		const path = eventParameters.get('path');

		try {
			fs.accessSync(path, fs.F_OK);
			this.initWatcher('*', {
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
				throw new JSSlave.JSSlaveError(error.message);
			});
		} catch(e) {
			if (e instanceof JSSlave.JSSlaveError) {
				throw e;
			} else {
				throw new JSSlave.JSSlaveError(e.message);
			}
		}
	}

	/**
	 * Stop the watch of the directory by fileCreated.
	 * @param  {UserParameters} userParameters - UserParameters sent to fileCreated.
	 * @return {Promise} Return a Promise.
	 */
	stopFileCreated(userParameters) {
		return new Promise((resolve) => {
			this.watcher.unwatch(userParameters.get('path'));
			resolve();
		});
	}

	/**
	 * Watch file modification inside a directory.
	 * @param  {ActionPointer} actionPointer - The pointer to the action.
	 * @param  {UserParameters} eventParameters - UserParameters that will be used by the event.
	 * @param  {UserParameters} actionParameters - UserParameters that will be used by the action.
	 */
	fileModified(actionPointer, eventParameters, actionParameters) {
		const path = eventParameters.get('path');

		try {
			fs.accessSync(path, fs.F_OK);
			this.initWatcher('*', {
				cwd: path,
				persistent: true,
				ignoreInitial: true
			});
			this.watcher.on('change', (filename) => {
				actionParameters.matchParameters([
					{name: 'filename', value: filename},
					{name: 'path', value: path}
				]);
				actionPointer.start(actionParameters);
			});
			this.watcher.on('error', (error) => {
				throw new JSSlave.JSSlaveError(error.message);
			});
		} catch(e) {
			if (e instanceof JSSlave.JSSlaveError) {
				throw e;
			} else {
				throw new JSSlave.JSSlaveError(e.message);
			}
		}
	}

	/**
	 * Stop the watch of the directory by fileModified.
	 * @param  {UserParameters} userParameters - UserParameters sent to fileModified.
	 * @return {Promise} Return a Promise.
	 */
	stopFileModified(userParameters) {
		return new Promise((resolve) => {
			this.watcher.unwatch(userParameters.get('path'));
			resolve();
		});
	}
}

module.exports = JSSlaveFile;
