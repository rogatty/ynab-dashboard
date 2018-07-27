export function initialize(/* application */) {
  // Callback for background color
  window.Chart.pluginService.register({
    beforeUpdate: function (chartInstance) {
      // Labels for forecast data have '?' character
      const numberOfRealData = chartInstance.data.labels.reduce(
        (count, label) => count + (label.indexOf('?') >= 0 ? 0 : 1),
        0
      );

      chartInstance.data.datasets.forEach((dataset) => {
        dataset.backgroundColor = dataset.data.map((data, index) => {
          if (typeof dataset.backgroundColor === 'function') {
            return dataset.backgroundColor.call(this, data, index < numberOfRealData);
          }
          return dataset.backgroundColor;
        });
      });
    }
  });
}

export default {
  initialize
};
