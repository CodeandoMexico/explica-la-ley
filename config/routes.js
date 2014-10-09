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

  '/login': {
    controller: 'user',
    action: 'login'
  },

  '/user/twitterAuthCallback': {
    controller: 'user',
    action: 'twitterAuthCallback'
  },

  'get /logout': {
    controller: 'user',
    action: 'logout'
  },

  // Custom routes here...
  // XXX: Order matters!

  '/article/create': {
    controller: 'article',
    action: 'create'
  },

  'post /article/search': {
    controller: 'article',
    action: 'search'
  },

  '/article/:id': {
    controller: 'article',
    action: 'find'
  },

  '/law/create': {
    controller: 'law',
    action: 'create'
  },

  'get /law/:id': {
    controller: 'law',
    action: 'find'
  },

  '/tag/create': {
    controller: 'tag',
    action: 'create'
  },

  '/reforma/:tag_slug/edit': {
    controller: 'tag',
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
  },

  'post /annotation/:id/voteup': {
    controller: 'annotation',
    action: 'voteup'
  },

  'post /annotation/:id/votedown': {
    controller: 'annotation',
    action: 'votedown'
  },

  'get /user': {
    controller: 'user',
    action: 'profile'
  },

  'post /user/saveEmail': {
    controller: 'user',
    action: 'saveEmail'
  },

  'post /user/forgetEmail': {
    controller: 'user',
    action: 'forgetEmail'
  },

  // If a request to a URL doesn't match any of the custom routes above, it is matched 
  // against Sails route blueprints.  See `config/blueprints.js` for configuration options
  // and examples.


  '/reforma/:tag_slug': {
    controller: 'tag',
    action: 'find'
  },

  '/reforma/:tag_slug/ley/:law_slug': {
    controller: 'law',
    action: 'find'
  },

  '/reforma/:tag_slug/ley/:law_slug/edit': {
    controller: 'law',
    action: 'edit'
  },

  '/reforma/:tag_slug/ley/:law_slug/articulo/:article_number': {
    controller: 'article',
    action: 'find'
  },

  '/reforma/:tag_slug/ley/:law_slug/articulo/:article_number/edit': {
    controller: 'article',
    action: 'edit'
  },

};
