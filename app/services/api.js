import {API} from 'ynab';

import Service from '@ember/service';

import config from 'ynab-dashboard/config/environment';

export default class ApiService extends Service {
  accessToken = config.APP.ACCESS_TOKEN;
  budgetId = config.APP.BUDGET_ID;
  targetCategoryId = config.APP.TARGET_CATEGORY_ID;
  creditCardCategoryGroupId = config.APP.CREDIT_CARD_CATEGORY_GROUP_ID;

  constructor() {
    super(...arguments);
    this.ynabAPI = new API(this.accessToken);
    this.model = {};
  }

  async loadInitialState() {
    const budgetResponse = await this.ynabAPI.budgets.getBudgetById(this.budgetId);
    const budgetDetail = budgetResponse.data.budget;

    this.model.targetCategory = budgetDetail.categories.find(category => category.id === this.targetCategoryId);

    this.model.targetCategoryMonths = budgetDetail.months
      .map((month) => {
        return {
          month: month.month,
          category: month.categories.find((category) => {
            return category.id === this.targetCategoryId;
          })
        };
      })
      .filter((month) => {
        // API returns all months since account creation
        return typeof month.category !== 'undefined' && month.category.balance > 0;
      });

    // First month is the future one
    this.model.targetCategoryMonths.shift();

    this.model.otherCategories = budgetDetail.categories.filter(
      category => category.id !== this.targetCategoryId &&
        category.activity < 0 &&
        category.category_group_id !== this.creditCardCategoryGroupId &&
        // Credit card but hidden
        category.original_category_group_id !== this.creditCardCategoryGroupId
    ).sort((a, b) => a.activity - b.activity);
  }
}
