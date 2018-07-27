import { helper } from '@ember/component/helper';

export function money(params/*, hash*/) {
  return (Math.abs(params[0]) / 1000).toLocaleString('pl', {
    currency: 'PLN',
    currencyDisplay: 'code',
    style: 'currency'
  });
}

export default helper(money);
