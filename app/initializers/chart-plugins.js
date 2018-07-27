export function initialize(/* application */) {
  // Callback for background color
  window.Chart.pluginService.register({
    beforeUpdate: function (chartInstance) {
      chartInstance.data.datasets.forEach(function (dataset) {
        dataset.backgroundColor = dataset.data.map(function (data) {
          if (typeof dataset.backgroundColor === 'function') {
            return dataset.backgroundColor.call(this, data);
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
