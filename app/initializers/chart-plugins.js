export function initialize() {
  let i = 0;

  // Callback for background color
  window.Chart.plugins.register({
    id: 'backgroundColorCallback',
    beforeUpdate: function (chartInstance) {
      // For some reason beforeUpdate is called twice at chart initialization which causes faulty render
      // This is a temporary fix
      if (++i > 1) {
        return;
      }

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
