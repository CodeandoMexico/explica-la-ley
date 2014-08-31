
/**
 * Compile CoffeeScript files to JavaScript.
 *
 * ---------------------------------------------------------------
 *
 * Compiles coffeeScript files from `assest/js` into Javascript and places them into
 * `.tmp/public/js` directory.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-coffee
 */
module.exports = function(grunt) {

	grunt.config.set('autoprefixer', {
		multiple_files: {
			expand: true,
			flatten: true,
			src: '.tmp/public/styles/*.css',
			dest: '.tmp/public/styles'
		},
		concat: {
			src: '.tmp/public/styles/*.css',
			dest: '.tmp/public/styles/*.css'
		}
	});

	grunt.loadNpmTasks('grunt-autoprefixer');
};
