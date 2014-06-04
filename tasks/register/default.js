module.exports = function (grunt) {
	grunt.registerTask('setup', ['db:install']);
	grunt.registerTask('default', ['compileAssets', 'linkAssets',  'watch']);
};
