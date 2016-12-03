'use strict';

const path = require('path');
const arrExclude = require('arr-exclude');
const readPkgUp = require('read-pkg-up');
const writePkg = require('write-pkg');
const avaInit = require('ava-init');
const dotProp = require('dot-prop');
const execa = require('execa');

function addPlugins(pkg) {
	const plugins = dotProp.get(pkg, 'ava.babel.plugins', []);

	const jsxPlugin = plugins.find(plugin => plugin[0] === 'transform-react-jsx');
	if (jsxPlugin) {
		jsxPlugin[1] = jsxPlugin[1] || {};
		jsxPlugin[1].pragma = 'h';
	} else {
		plugins.push(['transform-react-jsx', {pragma: 'h'}]);
	}

	dotProp.set(pkg, 'ava.babel.plugins', plugins);
}

function addPresets(pkg) {
	const presets = dotProp.get(pkg, 'ava.babel.presets', []);
	if (presets.indexOf('es2015-node4') === -1 && presets.indexOf('es2015') === -1) {
		presets.push('es2015-node4');
	}

	if (presets.indexOf('stage-2') === -1) {
		presets.push('stage-2');
	}

	dotProp.set(pkg, 'ava.babel.presets', presets);
}

function addBabelRegister(pkg) {
	const avaRequire = dotProp.get(pkg, 'ava.require', []);
	if (avaRequire.indexOf('babel-register') === -1) {
		avaRequire.push('babel-register');
	}

	dotProp.set(pkg, 'ava.require', avaRequire);
}

module.exports = options => {
	options = options || {};

	return avaInit(options).then(() => {
		const ret = readPkgUp.sync({
			cwd: options.cwd,
			normalize: false
		});

		const pkg = ret.pkg || {};
		const pkgPath = ret.path || path.resolve(options.cwd || '', 'package.json');

		addPresets(pkg);
		addPlugins(pkg);
		addBabelRegister(pkg);

		writePkg.sync(pkgPath, pkg);

		const devDependencies = pkg.devDependencies || {};

		let packages = [
			'babel-plugin-transform-react-jsx',
			'babel-preset-es2015-node4',
			'babel-preset-stage-2',
			'babel-register'
		].filter(name => !devDependencies[name]);

		if (devDependencies['babel-preset-es2015']) {
			packages = arrExclude(packages, 'babel-preset-es2015-node4');
		}

		if (options.skipInstall || packages.length === 0) {
			return;
		}

		return execa('npm', ['install', '--save-dev'].concat(packages), {
			stdio: 'inherit',
			cwd: path.dirname(pkgPath)
		});
	});
};
