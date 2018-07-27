import Component from '@ember/component';
import {computed} from '@ember-decorators/object';

export default class OtherCategoriesComponent extends Component {
  @computed('categories')
  get total() {
    return this.categories.reduce((currentTotal, category) => currentTotal + category.activity, 0);
  }
}
