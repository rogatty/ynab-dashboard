import Route from '@ember/routing/route';
import {service} from '@ember-decorators/service';

export default class ApplicationRoute extends Route {
  @service config;

  beforeModel() {
    if (this.config.isSetUp) {
      this.transitionTo('dashboard');
    } else {
      this.transitionTo('setup');
    }
  }
}
