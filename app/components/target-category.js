import Component from '@ember/component';
import {computed} from '@ember-decorators/object';
import {readOnly} from '@ember-decorators/object/computed';

export default class TargetCategoryComponent extends Component {
  balanceLabel = 'Bilans';
  budgetedLabel = 'Odłożone';

  @readOnly('model.targetCategory') category;
  @readOnly('model.targetCategoryMonths') months;

  @computed('months')
  get chartData() {
    return {
      datasets: [{
        borderColor: 'black',
        data: this.months.map(categoryMonth => {
          return Math.floor(categoryMonth.category.balance / 1000);
        }),
        fill: false,
        label: this.balanceLabel,
        type: 'line',
        yAxisID: 'balance'
      }, {
        backgroundColor(value) {
          return value < 0 ?
            'red' : value < 5000 ?
              'yellow' : 'green';
        },
        data: this.months.map(categoryMonth => {
          return Math.floor(categoryMonth.category.budgeted / 1000);
        }),
        label: this.budgetedLabel,
        yAxisID: 'budgeted'
      }],
      labels: this.months.map(categoryMonth => categoryMonth.month)
    };
  }

  @computed('category')
  get chartOptions() {
    const ticks = this.getTicks();

    return {
      responsive: false,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false
          },
          id: 'balance',
          position: 'right',
          scaleLabel: {
            display: true,
            labelString: this.balanceLabel
          },
          ticks: ticks.balance
        }, {
          gridLines: {
            display: false
          },
          id: 'budgeted',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: this.budgetedLabel
          },
          ticks: ticks.budgeted
        }]
      }
    };
  }

  // Align zeros on axes
  // @see https://stackoverflow.com/a/50334411/1050577
  getTicks() {
    const budgeted = this.months.map(categoryMonth => categoryMonth.category.budgeted);
    const budgetedMinValue = Math.floor(Math.min(...budgeted) / 1000);
    const budgetedMaxValue = Math.floor(Math.max(...budgeted) / 1000);
    const budgetedRange = budgetedMaxValue - budgetedMinValue;
    const budgetedMinRatio = budgetedMinValue / budgetedRange;
    const budgetedMaxRatio = budgetedMaxValue / budgetedRange;

    const balanceMinValue = 0;
    const balanceMaxValue = this.category.goal_target / 1000;
    const balanceRange = balanceMaxValue - balanceMinValue;
    const balanceMinRatio = balanceMinValue / balanceRange;
    const balanceMaxRatio = balanceMaxValue / balanceRange;

    const largestMinRatio = Math.min(budgetedMinRatio, balanceMinRatio);
    const largestMaxRatio = Math.max(budgetedMaxRatio, balanceMaxRatio);

    return {
      budgeted: {
        callback: (value, index, values) => {
          // Remove the first and the last ticks as they're calculated above and ugly
          return index === 0 || index === values.length - 1 ? null : value;
        },
        min: largestMinRatio * budgetedRange,
        max: largestMaxRatio * budgetedRange
      },
      balance: {
        callback: (value) => {
          // Balance should never go below zero!
          return value < 0 ? null : value;
        },
        min: largestMinRatio * balanceRange,
        max: largestMaxRatio * balanceRange
      }
    };
  }
}
