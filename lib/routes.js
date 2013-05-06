/**
 * All handlers defined here
 */

module.exports = {
// Website
  build: require('../routes/build')
, createJob: require('../routes/createJob')
, handleGithubWebhook: require('../routes/handleGithubWebhook')
, index: require('../routes/index')
, jobHomepage: require('../routes/jobHomepage')
, login: require('../routes/login')
, logout: require('../routes/logout')
, settings: require('../routes/settings')

// API
, setEnabledState: require('../routes/setEnabledState')
};
