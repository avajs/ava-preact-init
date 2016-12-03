#!/usr/bin/env node
'use strict';
const meow = require('meow');
const avaPreactInit = require('./');

meow(`
	Usage
	  $ ava-preact-init
`);

avaPreactInit();
