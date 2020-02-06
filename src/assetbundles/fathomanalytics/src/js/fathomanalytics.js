import Chart from 'chart.js';
import '../scss/fathomanalytics.scss';

window.FathomAnalytics = {};
window.FathomAnalytics.Global = class FathomAnalytics {
  // Expose Chart.js once
  static renderChart(ctx, options) {
    new Chart(ctx, options);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  new window.FathomAnalytics.Global();
});
