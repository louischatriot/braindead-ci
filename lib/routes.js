/**
 * All handlers defined here
 */

module.exports = {
  index: require('../routes/index')
, createJob: require('../routes/createJob')
, jobHomepage: require('../routes/jobHomepage')
, build: require('../routes/build')
, handleGithubWebhook: require('../routes/handleGithubWebhook')
};
