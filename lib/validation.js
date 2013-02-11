/**
 * Everything we need for validation
 */

var validators = {};


/**
 * Validation function which validate a field and add the error
 * message to the errors array if validation fails
 */
module.exports.validate = function (type, obj) {
  var errors = [], field
    , fields = Object.keys(obj), i;

  for (i = 0; i < fields.length; i += 1) {
    field = fields[i];
    if (validators[type][field].validator(obj[field]) === false) {
      errors.push(validators[type][field].errorMessage);
    }
  }

  return errors.length > 0 ? errors : null;
};


/**
 * Augment a request's renderValues by validation errors
 */
module.exports.saveErrorsForDisplay = function (req, errors, userInput) {
  req.renderValues.validationErrors = true;
  req.renderValues.errors = errors;
  req.renderValues.userInput = userInput;
};


/**
 * Register a new validator for this object type
 */
function registerValidator (type, field, errorMessage, validator) {
  if (! validators[type]) { validators[type] = {}; }

  validators[type][field] = { validator: validator
                            , errorMessage: errorMessage };
}


/**
 * Validators, sorted by object type (for now only job)
 */
function validateJobName (value) {
  if (value && value.match(/[a-zA-Z0-9 ]{1,20}/)) {
    return true;
  } else {
    return false;
  }
}

function validateJobRepo (value) {   // We just want a value to be entered, no tough validation here
  if (value && value.length > 0) {
    return true;
  } else {
    return false;
  }
}

function validateJobBranch (value) {
  if (value && value.length > 0) {
    return true;
  } else {
    return false;
  }
}

registerValidator('job', 'name', 'The name must be composed of between 1 and 20 alphanumerical characters and spaces', validateJobName);
registerValidator('job', 'repo', 'Please enter a repo name', validateJobRepo);
registerValidator('job', 'branch', 'Please enter a branch name', validateJobBranch);




