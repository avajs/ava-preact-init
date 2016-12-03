# ava-preact-init [![Build Status](https://travis-ci.org/avajs/ava-preact-init.svg?branch=master)](https://travis-ci.org/avajs/ava-preact-init)

> Set up AVA with [Preact](https://github.com/developit/preact)

This utility configures AVA to transform JSX with pragma required for Preact (`h`) and adds support for importing project files using Babel with existing configuration.
It also installs AVA, in case it's missing.


## Install

```
$ npm install --save ava-preact-init
```


## Usage

```js
const avaPreactInit = require('ava-preact-init');

avaPreactInit().then(() => {
	// done
});
```


## API

### avaPreactInit([options])

Returns a `Promise`.

#### options

#### cwd

Type: `string`<br>
Default: `'.'`

Current working directory.


## CLI

Install this module globally `$ npm install --global ava-preact-init` and run `$ ava-preact-init`.


## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes)
