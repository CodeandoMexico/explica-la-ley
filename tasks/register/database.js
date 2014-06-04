module.exports = function (grunt) {
  var spawn = require('child_process').spawn,
    which = spawn('which',  ['-s', 'psql']),
    is_ready = spawn('pg_isready'),
    tables = spawn('psql', ['-l']),
    done;


  grunt.registerTask('db:install', 'install database', function () {
    done  = this.async();

    process.stdout.write("Setting up your database...".green);
    which.on('exit', function (code, signal) {
      if (code > 0) {
        process.stdout.write("\nYou don't have postgres installed".red);
        process.stdout.write("\nIf you're using homebrew, install it with:");
        process.stdout.write("\nbrew install postgresql".yellow);
        process.stdout.write("\n\n");
        done(false);
      }
    });

    is_ready.on('exit', function (code, _) {
      if (code > 0) {
        process.stdout.write("\nPostgres is not running. Fire it up with:".yellow);
        process.stdout.write("\npg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start");
        process.stdout.write("\n\n");
        done(false);
      }
    });

    tables.stdout.on('data', function (data) {
      var table_name = 'cambia_la_ley';
      if (!(new RegExp(table_name)).test(data)) {
        process.stdout.write("\nDatabase table is not set.");
        process.stdout.write(" Set it up with:");
        process.stdout.write("\ncreatedb "+ table_name);
        process.stdout.write("\n\n");
        done(false);
      }
    });
  });
};
