import Route from '@ember/routing/route';
import { service } from '@ember-decorators/service';

export default class ApplicationRoute extends Route {
  @service api;

  async model() {
    await this.api.loadInitialState();

    return {
      otherCategories: this.api.otherCategories,
      targetCategory: this.api.targetCategory,
      targetCategoryMonths: this.api.targetCategoryMonths
    }
  }
}
