import Component from '@ember/component';
import {computed} from '@ember-decorators/object';

export default class OtherCategoriesComponent extends Component {
  @computed('model.otherCategories')
  get categories() {
    return this.model.otherCategories.map(category => {
      category.isOverspent = category.balance < 0;
      return category;
    });
  }

  @computed('model.otherCategories')
  get total() {
    return this.model.otherCategories.reduce((currentTotal, category) => currentTotal + category.activity, 0);
  }
}
