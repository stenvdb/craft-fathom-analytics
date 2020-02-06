import axios from 'axios';
import dayjs from 'dayjs';
import '../scss/reportwidget.scss';

window.FathomAnalytics.ReportWidget = class FathomReportWidget {
  constructor(config = {}) {
    this.config = Object.assign({
      before: dayjs().subtract(1, 'day').endOf('day')
    }, config);

    this.labels = [];
    this.range = [];
    this.data = [];

    this.init();
  }

  init() {
    const range = this.getRange();

    // Set chart.js labels and initial data (= 0)
    range.forEach((step) => {
      this.labels.push(step.label);
      this.data.push(0);
    });

    // Get Fathom data
    axios.get('actions/fathom-analytics/reports/report-widget', {
      params: {
        before: this.config.before.unix(),
        after: this.config.after.unix(),
        report: this.config.report,
      },
    }).then((response) => {
      // Update chart.js data array
      response.data.Data.forEach((row) => {
        const s = dayjs(row.Date).unix();
        const i = range.findIndex(r => s > r.start.unix() && s < r.end.unix());
        this.data[i] += parseInt(row[this.config.report], 10);
      });

      const options = {
        type: this.config.chart,
        data: {
          labels: this.labels,
          datasets: [
            {
              label: this.config.report,
              aspectRatio: 2.5,
              backgroundColor: this.config.chart === 'line' ? 'rgba(66,153,225, 0.1)' : '#4299E1',
              borderColor: '#4299E1',
              pointBackgroundColor: '#4299E1',
              borderWidth: 3,
              pointRadius: 2,
              pointHitRadius: 4,
              lineTension: 0,
              data: this.data
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          tooltips: {
            bodyFontColor: 'hsl(209, 18%, 30%)',
            backgroundColor: '#fff',
            borderColor: 'rgba(155, 155, 155, 0.1)',
            borderWidth: 1,
            caretPadding: 6,
            caretSize: 0,
            mode: 'index',
            titleFontColor: 'hsl(209, 18%, 30%)',
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                autoSkip: true,
                autoSkipPadding: 5,
                beginAtZero: true,
                fontColor: '#4299E1',
                mirror: true
              },
              gridLines: {
                drawBorder: false,
              }
            }],
            xAxes: [{
              ticks: {
                autoSkip: true,
                autoSkipPadding: 10,
                fontColor: '#4299E1',
              },
              // labels: {
              //   display: false
              // },
              gridLines: {
                display: false,
                drawBorder: false,
              }
            }]
          }
        }
      };

      const ctx = document.querySelector(`#widget${this.config.id} #myChart`).getContext('2d');
      window.FathomAnalytics.Global.renderChart(ctx, options);

      // Update total placeholder
      const sumEl = document.querySelector(`#widget${this.config.id} .js-fa-total`);
      const sum = this.data.reduce((a, b) => a + b);
      sumEl.innerHTML = sum;
    });
  }

  setDefaults(range) {
    range.forEach((step) => {
      this.labels.push(step.label);
      this.data.push(0);
    });
  }

  getRange() {
    switch (this.config.period) {
      case 'week': {
        this.config.after = dayjs().subtract(7, 'days').startOf('day');
        return this.getLastDays(7);
      }
      case 'month': {
        this.config.after = dayjs().subtract(30, 'days').startOf('day');
        return this.getLastDays(30);
      }
      case 'year': {
        this.config.after = dayjs().subtract(365, 'days').startOf('day');
        return this.getLastYear();
      }
      default: return [];
    }
  }

  getLastDays(days) {
    const a = [];
    for (let i = days; i > 0; i -= 1) {
      a.push({
        label: dayjs().subtract(i, 'days').format('D/M'),
        start: dayjs().subtract(i, 'days').startOf('day'),
        end: dayjs().subtract(i, 'days').endOf('day')
      });
    }
    return a;
  }

  getLastYear() {
    const a = [];

    // Get the first month
    a.push({
      label: dayjs().subtract(365, 'days').format('MMM'),
      start: dayjs().subtract(365, 'days').startOf('day'),
      end: dayjs().subtract(365, 'days').endOf('month').endOf('day'),
    });

    // Get the next 11 months
    for (let i = 1; i <= 11; i += 1) {
      a.push({
        label: a[i - 1].end.add(1, 'day').format('MMM'),
        start: a[i - 1].end.add(1, 'day'),
        end: a[i - 1].end.add(1, 'day').endOf('month')
      });
    }

    // Get the last month
    a.push({
      label: this.config.before.format('MMM'),
      start: a[a.length - 1].end.add(1, 'day'),
      end: this.config.before,
    });

    return a;
  }
};
