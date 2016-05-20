# js-slave-file

[![dependencies status](https://david-dm.org/js-slave/js-slave-file.svg)](https://david-dm.org/js-slave/js-slave-file)
[![dev-dependencies status](https://david-dm.org/js-slave/js-slave-file/dev-status.svg)](https://david-dm.org/js-slave/js-slave-file#info=devDependencies)

This slave manage file on the system.

## Available events

#### fileCreated

Trigger when a file is created

###### Parameters

name | descripion                                           | type
---- | ---------------------------------------------------- | ------
path | The path where we have to watch for new created file | String

###### Returned values

name     | descripion                               | type
-------- | ---------------------------------------- | ------
filename | The name of the new created file         | String
path     | The path where the file has been created | String

#### fileModified

Trigger when a file is modified

###### Parameters

name | descripion                                            | type
---- | ----------------------------------------------------- | ------
path | The path where we have to watch for new modified file | String

###### Returned values

name     | descripion                                | type
-------- | ----------------------------------------- | ------
filename | The name of the new modified file         | String
path     | The path where the file has been modified | String
