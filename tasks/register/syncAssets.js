module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'jst:dev',
		'sass:dev',
		'autoprefixer:multiple_files',
		'sync:dev',
		'coffee:dev'
	]);
};
