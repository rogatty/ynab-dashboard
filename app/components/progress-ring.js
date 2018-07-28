import Component from '@ember/component';
import {htmlSafe} from '@ember/string';
import {classNames} from '@ember-decorators/component';
import {computed} from '@ember-decorators/object';

// Based on https://css-tricks.com/building-progress-ring-quickly/

@classNames('progress-ring')
export default class ProgressRingComponent extends Component {
  radius = 60;
  stroke = 8;

  @computed('radius', 'stroke')
  get normalizedRadius() {
    return this.radius - this.stroke * 2;
  }

  @computed('normalizedRadius')
  get circumference() {
    return this.normalizedRadius * 2 * Math.PI;
  }

  @computed('radius')
  get doubleRadius() {
    return this.radius * 2;
  }

  @computed('circumference', 'progress')
  get style() {
    const offset = this.circumference - (this.progress / 100 * this.circumference);
    return htmlSafe(`stroke-dashoffset: ${offset}`);
  }
}
