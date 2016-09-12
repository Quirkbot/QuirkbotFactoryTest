'use strict'

var utils = require('./utils.js')
var path = require('path')
var gulp = require('gulp')
var runSequence = require('run-sequence')
var jeditor = require('gulp-json-editor')
var NWB = require('nwjs-builder')

/*
 * This task install src npm dependencies
 */
gulp.task('install-dependencies', function (cb) {
	utils.pass()
	.then(utils.execute('npm cache clean'))
	.then(utils.execute('npm --no-optional --production --prefix src install src'))
	.then(function() {
		cb()
	})
	.catch(cb)
})

/*
 * This task adds "*://localhost/*" to the extension allowed domains
 */
gulp.task('patch-extension', function () {
	return gulp.src(
			path.resolve( 'src', 'extension', 'manifest.json' )
		)
		.pipe(
			jeditor(function (json) {
				var matches = json.externally_connectable.matches
				if( matches.indexOf( '*://localhost/*' ) == -1 ) {
					matches.push('*://localhost/*')
				}
				return json
			})
		)
		.pipe(
			gulp.dest( path.resolve( 'src', 'extension' ) )
		)
})

/*
 * This task moves CODE's polymer build from lite environment to the app root
 */
gulp.task('move-code', function () {
	return gulp.src(
		path.resolve('src', 'node_modules', 'quirkbot-code-static', 'dist', 'lite', 'dist_polymer', '**')
	)
	.pipe(gulp.dest(path.resolve('src', 'code')))
})

/*
 * This task moves extensions's build to the app root
 */
gulp.task('move-extension', function () {
	return gulp.src(
		path.resolve('src', 'node_modules', 'quirkbot-chrome-app', 'dist', '**')
	)
	.pipe(gulp.dest(path.resolve('src', 'extension')))
})

/*
 * This task moves all needed files around
 */
gulp.task('move-files', ['move-code', 'move-extension'])


/*
 * This task makes the app ready to execute
 */
gulp.task('compose', function(cb) {
	runSequence(
		'pre-clean',
		'pre-clean',
		'install-dependencies',
		'move-files',
		'patch-extension',
		'post-clean',
		cb
	)
})

/*
 * This task builds the app as a platform specified executable program
 */
gulp.task('build', ['compose'], function (cb) {
	var pkg = require(path.resolve('src','package.json'))
	// Build the app
	NWB.commands.nwbuild(
		'src',
		{
			outputDir: 'build',
			version: '0.17.1-sdk',
			outputName: `${pkg.name}-${pkg.version}-{target}`,
			executableName: `${pkg['executable-name']}`,
			sideBySide: true
		},
		cb
	)
})
gulp.task('build-multi', ['compose'], function (cb) {
	var pkg = require(path.resolve('src','package.json'))
	// Build the app
	NWB.commands.nwbuild(
		'src',
		{
			outputDir: 'build',
			version: '0.17.1-sdk',
			platforms: 'win32,osx64',
			outputName: `${pkg.name}-${pkg.version}-{target}`,
			executableName: `${pkg['executable-name']}`,
			sideBySide: true
		},
		cb
	)
})


/*
 * This task clean everything produced by the builds
 */
gulp.task('pre-clean', function (cb) {
	utils.pass()
	.then(utils.deleteDir(path.resolve('build')))
	.then(utils.deleteDir(path.resolve('src', 'node_modules')))
	.then(utils.deleteDir(path.resolve('src', 'code')))
	.then(utils.deleteDir(path.resolve('src', 'uuids')))
	.then(utils.mkdir(path.resolve('src', 'uuids')))
	.then(utils.deleteDir(path.resolve('src', 'extension')))
	.then(utils.deleteDir(path.resolve('src', 'etc')))
	.then(function() {
		cb()
	})
	.catch(cb)
})

/*
 * This task cleans the app so it doesn't contains unused big source files
 */
gulp.task('post-clean', function (cb) {
	utils.pass()
	.then(utils.execute('npm --prefix src uninstall quirkbot-code-static'))
	.then(utils.execute('npm --prefix src uninstall quirkbot-chrome-app'))
	.then(utils.deleteDir(path.resolve('src', 'etc')))
	.then(function() {
		cb()
	})
	.catch(cb)
})

module.exports = gulp
