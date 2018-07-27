module.exports = function (env) {
  return {
    clientAllowedKeys: [
      // TODO ideally, this wouldn't be sent to the browser
      // While it is here, the app needs to be kept private
      'ACCESS_TOKEN',
      'BUDGET_ID',
      'CREDIT_CARD_CATEGORY_GROUP_ID',
      'TARGET_CATEGORY_ID'
    ],
    // Fail build when there is missing any of clientAllowedKeys environment variables.
    // By default false.
    failOnMissingKey: false,
  };
};
