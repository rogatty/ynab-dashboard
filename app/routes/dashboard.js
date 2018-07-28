import Route from '@ember/routing/route';
import {action} from '@ember-decorators/object';
import {service} from '@ember-decorators/service';

export default class DashboardRoute extends Route {
  @service api;
  @service config;

  async model() {
    await this.api.loadInitialState();

    return this.api.model;
  }

  @action logOut() {
    this.config.clear();
    this.transitionTo('setup');
  }
}
