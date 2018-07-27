import Component from '@ember/component';
import {readOnly} from '@ember-decorators/object/computed';
import {classNames} from '@ember-decorators/component';

@classNames('target-category-summary')
export default class TargetCategorySummaryComponent extends Component {
  @readOnly('model.targetCategory') category;
}
