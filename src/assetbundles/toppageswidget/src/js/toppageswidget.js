import axios from 'axios';
import dayjs from 'dayjs';
import '../scss/toppageswidget.scss';

window.FathomAnalytics.TopPagesWidget = class FathomTopPagesWidget {
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
    // Set the after date
    this.setAfter();

    // Get Fathom data
    axios.get('actions/fathom-analytics/reports/top-pages-widget', {
      params: {
        before: this.config.before.unix(),
        after: this.config.after.unix()
      },
    }).then((response) => {
      const labels = [];
      const data = [];

      // Update chart.js data & labels array
      response.data.Data.forEach((row) => {
        labels.push(row.Pathname);
        data.push(row.Pageviews);
      });

      const options = {
        type: 'horizontalBar',
        data: {
          labels,
          datasets: [
            {
              label: 'Pageviews',
              aspectRatio: 2.5,
              backgroundColor: 'rgba(66,153,225, 0.1)',
              borderColor: 'rgba(66,153,225, 0.1)',
              pointBackgroundColor: '#4299E1',
              barThickness: 26,
              borderWidth: 0,
              pointRadius: 2,
              pointHitRadius: 4,
              lineTension: 0,
              data
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
                display: false,
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

      document.querySelector(`#widget${this.config.id} #myChart`).style.height = `${(data.length * 30) + 40}px`;
    });
  }

  setDefaults(range) {
    range.forEach((step) => {
      this.labels.push(step.label);
      this.data.push(0);
    });
  }

  setAfter() {
    switch (this.config.period) {
      case 'week': {
        this.config.after = dayjs().subtract(7, 'days').startOf('day');
        break;
        // return this.getLastDays(7);
      }
      case 'month': {
        this.config.after = dayjs().subtract(30, 'days').startOf('day');
        break;
        // return this.getLastDays(30);
      }
      case 'year': {
        this.config.after = dayjs().subtract(365, 'days').startOf('day');
        break;
        // return this.getLastYear();
      }
      default: break;
    }
  }

  // getLastDays(days) {
  //   const a = [];
  //   for (let i = days; i > 0; i -= 1) {
  //     a.push({
  //       label: dayjs().subtract(i, 'days').format('D/M'),
  //       start: dayjs().subtract(i, 'days').startOf('day'),
  //       end: dayjs().subtract(i, 'days').endOf('day')
  //     });
  //   }
  //   return a;
  // }

  // getLastYear() {
  //   const a = [];

  //   // Get the first month
  //   a.push({
  //     label: dayjs().subtract(365, 'days').format('MMM'),
  //     start: dayjs().subtract(365, 'days').startOf('day'),
  //     end: dayjs().subtract(365, 'days').endOf('month').endOf('day'),
  //   });

  //   // Get the next 11 months
  //   for (let i = 1; i <= 11; i += 1) {
  //     a.push({
  //       label: a[i - 1].end.add(1, 'day').format('MMM'),
  //       start: a[i - 1].end.add(1, 'day'),
  //       end: a[i - 1].end.add(1, 'day').endOf('month')
  //     });
  //   }

  //   // Get the last month
  //   a.push({
  //     label: this.config.before.format('MMM'),
  //     start: a[a.length - 1].end.add(1, 'day'),
  //     end: this.config.before,
  //   });

  //   return a;
  // }
};
