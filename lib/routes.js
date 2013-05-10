/**
 * All handlers defined here
 */

module.exports = {
// Website
  build: require('../routes/build')
, handleGithubWebhook: require('../routes/handleGithubWebhook')
, index: require('../routes/index')
, jobs: require('../routes/jobs')
, login: require('../routes/login')
, logout: require('../routes/logout')
, settings: require('../routes/settings')
, users: require('../routes/users')

// API
, setEnabledState: require('../routes/setEnabledState')
};
