import path from 'path';
import fs from 'fs';
import tempWrite from 'temp-write';
import {get} from 'dot-prop';
import test from 'ava';
import m from './';

function run(pkg) {
	const filepath = tempWrite.sync(JSON.stringify(pkg), 'package.json');

	return m({
		cwd: path.dirname(filepath),
		skipInstall: true
	}).then(() => JSON.parse(fs.readFileSync(filepath, 'utf8')));
}

test('empty package.json', async t => {
	const pkg = await run({});

	t.deepEqual(pkg.ava, {
		require: ['babel-register'],
		babel: {
			presets: ['es2015-node4', 'stage-2'],
			plugins: [['transform-react-jsx', {pragma: 'h'}]]
		}
	});
});

test('has existing babel-register', async t => {
	const pkg = await run({
		ava: {
			babel: {
				require: ['babel-register']
			}
		}
	});

	t.deepEqual(get(pkg, 'ava.babel.require'), ['babel-register']);
});

test('has existing jsx plugin', async t => {
	const pkg = await run({
		ava: {
			babel: {
				plugins: [['transform-react-jsx']]
			}
		}
	});

	t.deepEqual(get(pkg, 'ava.babel.plugins.0'), ['transform-react-jsx', {pragma: 'h'}]);
});

test('has existing es2015-node4 preset', async t => {
	const pkg = await run({
		ava: {
			babel: {
				presets: ['es2015-node4']
			}
		}
	});

	t.deepEqual(get(pkg, 'ava.babel.presets'), ['es2015-node4', 'stage-2']);
});

test('has existing es2015 preset', async t => {
	const pkg = await run({
		ava: {
			babel: {
				presets: ['es2015']
			}
		}
	});

	t.deepEqual(get(pkg, 'ava.babel.presets'), ['es2015', 'stage-2']);
});

test('has existing stage-2 preset', async t => {
	const pkg = await run({
		ava: {
			babel: {
				presets: ['stage-2']
			}
		}
	});

	t.deepEqual(get(pkg, 'ava.babel.presets'), ['stage-2', 'es2015-node4']);
});

test.serial('installs all dependencies', async t => {
	const filepath = tempWrite.sync(JSON.stringify({}), 'package.json');

	await m({cwd: path.dirname(filepath)});

	const pkg = JSON.parse(fs.readFileSync(filepath, 'utf8'));

	t.truthy(get(pkg, 'devDependencies.babel-register'));
	t.truthy(get(pkg, 'devDependencies.babel-plugin-transform-react-jsx'));
	t.truthy(get(pkg, 'devDependencies.babel-preset-es2015-node4'));
	t.truthy(get(pkg, 'devDependencies.babel-preset-stage-2'));
});

test.serial('skip babel-register dependency', async t => {
	const filepath = tempWrite.sync(JSON.stringify({
		devDependencies: {'babel-register': '*'}
	}), 'package.json');

	await m({cwd: path.dirname(filepath)});

	const pkg = JSON.parse(fs.readFileSync(filepath, 'utf8'));
	t.is(get(pkg, 'devDependencies.babel-register'), '*');
});

test.serial('skip babel-plugin-transform-react-jsx dependency', async t => {
	const filepath = tempWrite.sync(JSON.stringify({
		devDependencies: {'babel-plugin-transform-react-jsx': '*'}
	}), 'package.json');

	await m({cwd: path.dirname(filepath)});

	const pkg = JSON.parse(fs.readFileSync(filepath, 'utf8'));
	t.is(get(pkg, 'devDependencies.babel-plugin-transform-react-jsx'), '*');
});

test.serial('skip babel-preset-es2015-node4 dependency', async t => {
	const filepath = tempWrite.sync(JSON.stringify({
		devDependencies: {'babel-preset-es2015-node4': '*'}
	}), 'package.json');

	await m({cwd: path.dirname(filepath)});

	const pkg = JSON.parse(fs.readFileSync(filepath, 'utf8'));
	t.is(get(pkg, 'devDependencies.babel-preset-es2015-node4'), '*');
});

test.serial('skip babel-preset-es2015-node4 dependency if es2015 preset is installed', async t => {
	const filepath = tempWrite.sync(JSON.stringify({
		devDependencies: {'babel-preset-es2015': '*'}
	}), 'package.json');

	await m({cwd: path.dirname(filepath)});

	const pkg = JSON.parse(fs.readFileSync(filepath, 'utf8'));
	t.falsy(get(pkg, 'devDependencies.babel-preset-es2015-node4'));
	t.is(get(pkg, 'devDependencies.babel-preset-es2015'), '*');
});

test.serial('skip babel-preset-stage-2 dependency', async t => {
	const filepath = tempWrite.sync(JSON.stringify({
		devDependencies: {'babel-preset-stage-2': '*'}
	}), 'package.json');

	await m({cwd: path.dirname(filepath)});

	const pkg = JSON.parse(fs.readFileSync(filepath, 'utf8'));
	t.is(get(pkg, 'devDependencies.babel-preset-stage-2'), '*');
});
