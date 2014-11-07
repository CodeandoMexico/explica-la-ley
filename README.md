Cambia la Ley ([español](/LEEME.md))
============

'Cambia la Ley' is a proposal to:
- Translate the law for citizens unfamiliar with the legislative
  jargon.
- Summarize to the most relevant sections of the law.
- See the original text of the law, so you can draw your own
  conclusions.

##Dependencies
- Node.js >= v0.10.24
- NPM >= 1.3.10
- Sails.js = 0.10.5

Install the rest of the packages listed in ``package.json`` by running `sudo npm install` in the project's directory.

##Installation
1. Install node.js ([Instructions](http://howtonode.org/how-to-install-nodejs))
2. Install sails `sudo npm -g install sails`
3. Install grunt `npm install grunt` and `npm install grunt-core`

##Configuration
The project requires certain environment variables in order to have database access and allow Twitter's auth.

###Database
PostgreSQL is used by default. The database connection is configured in ``config/connections.js``.
This file can hold many configurations. For example:
```
postgresql: {
  adapter   : 'sails-postgresql',
  host      : process.env.PG_HOST,
  port      : process.env.PG_PORT,
  user      : process.env.PG_USER,
  password  : process.env.PG_PASSWORD,
  database  : process.env.PG_DATABASE
}
```
The name of this configuration settings is ``postgresql``, which uses the ``sails-postgresql`` module previously installed.
The rest of the variables should be defined in your server's environment. For example, if your app is hosted in Heroku, you should define the ``PG_HOST``, ``PG_PORT``, etc. environment variables.

For your app to use one of the previously defined configurations in ``config/connections.js``, its name must be specified inside ``config/models.js``, in the ``connection`` attribute:
```
module.exports.models = { 
  connection: 'postgresql',
  migrate: 'safe'
};
```
IMPORTANT: the ``migrate`` variable can have 3 possible values:
- ``safe``: The database's structure will not be modified, even if the were changed.
- ``alter``: The database's contents will be kept. Its structure will be modified according to the models (experimental function).
- ``drop``: Every time the app is started, the database's contents will be lost. Its structure will change according to the models.
Please read Sails.js' [oficial documentation] (http://sailsjs.org/#/documentation/concepts/ORM/model-settings.html).

###Twitter OAuth
In order to authenticate users via Twitter, you should have a registered Twitter app (https://apps.twitter.com).
The ``config/globals.js`` file declares an instance of the ``node-twitter-api`` module (previously installed),
whose task is to negotiate user authentication with Twitter servers:

```
var twitterApi = require('node-twitter-api');
var twitterApiInstance = new twitterApi({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callback: process.env.TWITTER_CALLBACK_HOSTNAME + process.env.TWITTER_CALLBACK_FUNCTION
});
```
This instance uses 4 environment variables:
- ``TWITTER_KEY``: Consumer key / API key (https://apps.twitter.com).
- ``TWITTER_SECRET``: Consumer secret / API secret (https://apps.twitter.com).
- ``TWITTER_CALLBACK_HOSTNAME``: Your server's URL, to where Twitter will take a user after he/she has been authenticated. Example: ``http://explica.la``.
- ``TWITTER_CALLBACK_FUNCTION``: Your app's function in charge of creating user sessions. Its default value is ``/user/twitterAuthCallback``.

###The config/local.js file
Sails uses this file to overwrite configuration settings from other files in the ``config`` folder. This file is useful if you wish to test your app locally. For example, if you want to use a different database server, you'll need to modify the ``postgresql`` connection previously created. This can be done by inserting this in your ``config/local.js`` file:
```
module.exports.connections = {
  postgresql: {
    adapter : 'sails-postgresql',
    host : 'db.example.org',
    port : '5432',
    user : 'my_user',
    password : 'my_pass',
    database : 'db_name'
  }
}
```
To use Twitter's authentication while the project runs locally, you should have something like:
```
var twitterApi = require('node-twitter-api');
var my_conf =  new twitterApi({
    consumerKey: 'my_other_key',
    consumerSecret: 'my_other_secret',
    callback: 'http://127.0.0.1:1337/user/twitterAuthCallback'
})
module.exports.globals = {
  twitterApi: my_conf,
}
```

##Usage
After configuring your project, navigate to its root directory and do ``sails lift``.

###Users
There are 3 user roles:
- ``user``: can create, edit, destroy, and vote for annotations.
- ``expert``: can do all of the user's actions, but his/her annotations are shown with a different color.
- ``admin``: can do all of the expert's actions, in addition to being able to create articles, laws, and tags.


IMPORTANT: because of development reasons, some of CodeandoMexico's team members were "hardcoded" as admins in the app's policies (``api/policies.js``). Make sure to delete lines 3 to 11 from ``expertRole.js`` and ``adminRole.js`` if you forked this porject before this [commit] (https://github.com/CodeandoMexico/cambia-la-ley/commit/e3641df6283b8291eb3b1ffb5eb4443e299e60b8).

Every user that's created in the database gets the default role: ``user``. Roles are given via direct database manipulation (example: ``UPDATE "user" set role = 'admin' where id = 1;``).

IMPORTANT: If you use PostgreSQL, since the word ``user`` has a special meaning and our user table is named this way, you'll need to make reference to this table by using double quotes in your queries (example: ``SELECT * FROM "user";``).

###Tags, Leyes y Artículos
- A tag is a collection of laws
- A law belongs to only one tag
- A law is a collection of articles
- An article belongs to only one law

Create:
- ``/tag/create``: Create tags
- ``/law/create``: Create laws
- ``/article/create``: Create articles

Edit:
- Simply append the word ``/edit`` to the URL of the resource to edit (a tag, a law, or an article)
- The user must have the ``admin`` role

Delete:
- Requires direct queries against the database

##Demo
[Explica.la/ley](http://explica.la/ley)

##Questions or issues?
We keep the project's conversation in our issues page [issues](https://github.com/CodeandoMexico/cambia-la-ley/issues). If you have any other question you can reach us at <equipo@codeandomexico.org>.

##Contribute
We want this project to be the result of a community effort. You can collaborate with [code](https://github.com/CodeandoMexico/cambia-la-ley/pulls), [ideas](https://github.com/CodeandoMexico/cambia-la-ley/issues) and [bugs](https://github.com/CodeandoMexico/cambia-la-ley/issues). Read our [CONTRIBUTE](/CONTRIBUTE.md) file.

##Core Team

This project is an initiative of [Codeando México](http://www.codeandomexico.org).
The core team:
- [Braulio Chávez](https://github.com/HackerOfDreams)
- [Eduardo Salinas](https://github.com/lalo)
- [Adrián Rangel](https://github.com/acrogenesis)

##License
Available under the license: GNU General Public License (GPL) v3.0. Read the document [LICENSE](/LICENSE) for more information

Created by [Codeando México](http://www.codeandomexico.org), 2014.

![alt text](http://blog.codeandomexico.org/images/logo.png "Codeando México")
