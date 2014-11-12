var twitterApi = require('node-twitter-api');
var twitterApiInstance = new twitterApi({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callback: process.env.TWITTER_CALLBACK_HOSTNAME + process.env.TWITTER_CALLBACK_FUNCTION
});

function getFriendlyDate(date) {
  var moment = require('moment');
  moment.locale('es-MX');
  return moment(date).fromNow();
}

module.exports.globals = {
  _: true,
  async: true,
  sails: true,
  services: true,
  models: true,
  twitterApi: twitterApiInstance,
  getFriendlyDate: getFriendlyDate
};
