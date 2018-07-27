import Component from '@ember/component';
import {computed} from '@ember-decorators/object';
import {readOnly} from '@ember-decorators/object/computed';
import {classNames} from '@ember-decorators/component';

@classNames('target-category-chart')
export default class TargetCategoryChartComponent extends Component {
  balanceLabel = 'Bilans';
  budgetedLabel = 'Odłożone';

  @readOnly('model.targetCategory') category;

  @computed('model.targetCategoryMonths')
  get months() {
    const months = this.model.targetCategoryMonths;

    // Last month is a future one
    months.pop();
    this.addMonthBeforeTheFirst(months);
    this.addForecast(months);

    return months;
  }

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
        backgroundColor(value, realData) {
          if (realData) {
            return value < 0 ?
              '#ff0000' : value < 5000 ?
                '#ECA01A' : '#48CC00';
          } else {
            return 'grey';
          }
        },
        data: this.months.map(categoryMonth => {
          return Math.floor((categoryMonth.category.budgeted + categoryMonth.category.activity) / 1000);
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
      responsive: true,
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
    const budgeted = this.months.map(
      categoryMonth => (categoryMonth.category.budgeted + categoryMonth.category.activity)
    );
    const budgetedMinValue = Math.floor(Math.min(...budgeted) / 1000);
    const budgetedMaxValue = Math.floor(Math.max(...budgeted) / 1000);
    const budgetedRange = budgetedMaxValue - budgetedMinValue;
    const budgetedMinRatio = budgetedMinValue / budgetedRange;
    const budgetedMaxRatio = budgetedMaxValue / budgetedRange;

    const balance = this.months.map(categoryMonth => categoryMonth.category.balance);
    const balanceMinValue = 0;
    const balanceMaxValue = Math.floor(Math.max(...balance) / 1000);
    const balanceRange = balanceMaxValue - balanceMinValue;
    const balanceMinRatio = balanceMinValue / balanceRange;
    const balanceMaxRatio = balanceMaxValue / balanceRange;

    const largestMinRatio = Math.min(budgetedMinRatio, balanceMinRatio);
    const largestMaxRatio = Math.max(budgetedMaxRatio, balanceMaxRatio);

    return {
      budgeted: {
        callback: (value, index, values) => {
          // Remove the first and the last ticks as they're calculated above and ugly
          return index === 0 || index === values.length - 1 ? null : value.toLocaleString('pl', {
            currency: 'PLN',
            currencyDisplay: 'code',
            style: 'currency'
          });
        },
        min: largestMinRatio * budgetedRange,
        max: largestMaxRatio * budgetedRange
      },
      balance: {
        callback: (value) => {
          return value < 0 || value > (this.category.goal_target / 1000) ? null : value.toLocaleString('pl', {
            currency: 'PLN',
            currencyDisplay: 'code',
            style: 'currency'
          });
        },
        min: largestMinRatio * balanceRange,
        max: largestMaxRatio * balanceRange
      }
    };
  }

  addMonthBeforeTheFirst(months) {
    const monthBeforeTheFirst = this.getMonthWithOffset(months[0].month, -1);

    months.unshift({
      month: monthBeforeTheFirst,
      category: {
        activity: 0,
        balance: 0,
        budgeted: 0
      }
    });
  }

  addForecast(months) {
    const forecastPerMonth = Math.floor(
      months
        .slice(-3)
        .reduce((sum, currentMonth) => (currentMonth.category.budgeted + currentMonth.category.activity) + sum, 0) / 3
    );

    let lastMonth = months.slice(-1)[0];
    let balance = lastMonth.category.balance;

    while (balance < this.category.goal_target) {
      const forecastedMonth = {
        month: `?${this.getMonthWithOffset(lastMonth.month, 1)}?`,
        category: {
          activity: 0,
          balance: lastMonth.category.balance + forecastPerMonth,
          budgeted: forecastPerMonth
        }
      };

      months.push(forecastedMonth);
      lastMonth = forecastedMonth;
      balance += forecastPerMonth;
    }
  }

  getMonthWithOffset(originalMonth, offset) {
    const month = new Date(originalMonth);
    month.setMonth(month.getMonth() + offset);
    return month.toISOString().slice(0, 10);
  }
}
