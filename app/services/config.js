import Service from '@ember/service';

export default class ConfigService extends Service {
  isSetUp = false;

  constructor() {
    super(...arguments);

    const accessToken = window.localStorage.getItem('accessToken');

    if (accessToken) {
      this.accessToken = accessToken;
      this.isSetUp = true;
    }
  }

  clear() {
    this.accessToken = null;
    this.isSetUp = false;
    window.localStorage.clear();
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
    window.localStorage.setItem('accessToken', accessToken);
  }
}
