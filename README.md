# Snips-MM2-Bridge

This is an extension for the [MagicMirror²](https://github.com/MichMich/MagicMirror).  It provides provides a interface to connect the offline voice recognition snips with the Magic Mirror Software and is therefor required for all my other modules that make use of snips.
To work this module requires the offline Voice Recognition Snips. A explanation on how to install Snips and the App is included in the installation Guide.


##Supported Modules
1. [MMM-SnipsHideShow](https://gitlab.com/CaptnsTech/mmm-snipshideshow)

More modules will follow soon. If you want your module to be supported just open a gitlab issue


## Installation
1. Ensure that you have the necessary libraries/clients for mqtt installed on the computer that will be running this extension.  (For example, running `sudo apt-get install mosquitto mosquitto-clients` on Debian-based distributions.)
2. Navigate into your MagicMirror's `modules` folder and execute `git clone https://gitlab.com/CaptnsTech/snips-mm2-bridge.git`. A new folder will azppear, likely called `snips-mm2-bridge`.  Navigate into it.
3. Execute `npm install` to install the node dependencies.
4. The installation of Snips can be done according to this [explanation](https://snips.gitbook.io/getting-started/installation).



## Using the module

To use this module, add this to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'snips-mm2-bridge',
		config: {
			// See 'Configuration options' for more information.
		}
	}
]
````

## Configuration options

The following options can be configured:

| Option  | Description  |
|---|---|
| `mqttServer`  | Connection string for the server to connect to (e.g. `mqtt://localhost`) **See:** Server IP  |

## Server IP

IP adress the mqtt server snips is connected to is running on. `mqtt://localhost` when snips is running on the same device (and you do use the MQTT Broker coming with snips)


## Dependencies
- [mqtt](https://www.npmjs.com/package/mqtt) (installed via `npm install`)

## Contributing Guidelines

Contributions of all kinds are welcome, not only in the form of code but also with regards bug reports and documentation.

Please keep the following in mind:

- **Bug Reports**:  Make sure you're running the latest version. If the issue(s) still persist: please open a clearly documented [issue](https://gitlab.com/CaptnsTech/snips-mm2-bridge/issues) with a clear title.
- **Minor Bug Fixes**: Please send a pull request with a clear explanation of the issue or a link to the issue it solves.
- **Major Bug Fixes**: please discuss your approach in an GitLab [issue](https://gitlab.com/CaptnsTech/snips-mm2-bridge/issues) before you start to alter a big part of the code.
- **New Features**: please discuss in a GitLab [issue](https://gitlab.com/CaptnsTech/snips-mm2-bridge/issues) before you start to alter a big part of the code. Without discussion upfront, the pull request will not be accepted / merged.


##Planned
1. password/username and tls support for mqtt


The MIT License (MIT)
=====================

Copyright © 2018 Max Bachmann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
