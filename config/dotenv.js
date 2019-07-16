module.exports = function () {
  return {
    clientAllowedKeys: [
      'BUDGET_ID',
      'CREDIT_CARD_CATEGORY_GROUP_ID',
      'TARGET_CATEGORY_ID'
    ],
    // Fail build when there is missing any of clientAllowedKeys environment variables.
    // By default false.
    failOnMissingKey: false,
  };
};
