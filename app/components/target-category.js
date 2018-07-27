import Component from '@ember/component';
import {readOnly} from '@ember-decorators/object/computed';

export default class TargetCategoryComponent extends Component {
  @readOnly('model.targetCategory') category;
  @readOnly('model.targetCategoryMonths') months;
}
