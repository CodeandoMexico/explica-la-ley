/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 * 
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.) 
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg` 
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or 
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {


  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  // 
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)
  '/': {
    controller: 'page',
    action: 'redirect'
  },

  '/ley': {
    controller: 'page',
    action: 'homepage'
  },

  '/ley/login': {
    view: 'login'
  },

  'get /ley/logout': {
    controller: 'user',
    action: 'logout'
  },

  // Custom routes here...

  'get /ley/article/new': {
    controller: 'article',
    action: 'newArticle'
  },

  'get /ley/article/edit/:id': {
    controller: 'article',
    action: 'edit'
  },

  'get /ley/law/new': {
    controller: 'law',
    action: 'newLaw'
  },

  'get /ley/law/edit/:id': {
    controller: 'law',
    action: 'edit'
  },

  '/storage': {
    controller: 'storage',
    action: 'index'
  },

  'get /storage/annotation': {
    controller: 'annotation',
    action: 'index'
  },

  'post /storage/annotation': {
    controller: 'annotation',
    action: 'create'
  },

  'put /storage/annotation/:id': {
    controller: 'annotation',
    action: 'update'
  },

  'delete /storage/annotation/:id': {
    controller: 'annotation',
    action: 'destroy'
  }


  // If a request to a URL doesn't match any of the custom routes above, it is matched 
  // against Sails route blueprints.  See `config/blueprints.js` for configuration options
  // and examples.

};
