module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
		'sass:dev',
		'autoprefixer:multiple_files',
		'copy:dev',
		'coffee:dev'
	]);
};
