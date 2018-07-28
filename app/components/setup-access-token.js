import Component from '@ember/component';
import {classNames, tagName} from '@ember-decorators/component';
import {action} from '@ember-decorators/object';

@classNames('setup-access-token')
@tagName('form')
export default class SetupAccessTokenComponent extends Component {
  accessToken = null;

  @action
  submit() {
    this.saveAccessToken(this.accessToken);
  }
}
