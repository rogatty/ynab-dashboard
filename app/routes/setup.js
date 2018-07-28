import Route from '@ember/routing/route';
import {action} from '@ember-decorators/object';
import {service} from '@ember-decorators/service';

export default class SetupRoute extends Route {
  @service config;

  @action
  saveAccessToken(accessToken) {
    this.config.setAccessToken(accessToken);
    this.transitionTo('dashboard');
  }
}
