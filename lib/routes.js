/**
 * All handlers defined here
 */

module.exports = {
// Website
  index: require('../routes/index')
, createJob: require('../routes/createJob')
, jobHomepage: require('../routes/jobHomepage')
, build: require('../routes/build')
, handleGithubWebhook: require('../routes/handleGithubWebhook')
, settings: require('../routes/settings')

// API
, setEnabledState: require('../routes/setEnabledState')
};
