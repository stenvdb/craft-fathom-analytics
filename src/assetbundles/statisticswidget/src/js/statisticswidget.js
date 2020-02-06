import axios from 'axios';
import dayjs from 'dayjs';
import '../scss/statisticswidget.scss';

window.FathomAnalytics.StatisticsWidget = class FathomStatisticsWidget {
  constructor(config = {}) {
    this.config = Object.assign({
      before: dayjs().subtract(1, 'day').endOf('day')
    }, config);

    this.wrapper = document.querySelector(`#widget${this.config.id} .js-fa-realtime`);
    this.uniqueVisEl = document.querySelector(`#widget${this.config.id} .js-fa-unique-visitors`);
    this.pageviewsEl = document.querySelector(`#widget${this.config.id} .js-fa-pageviews`);
    this.avgTimeEl = document.querySelector(`#widget${this.config.id} .js-fa-avg-time`);
    this.bounceRateEl = document.querySelector(`#widget${this.config.id} .js-fa-bounce-rate`);

    this.onGet = this.get.bind(this);

    this.init();
  }

  init() {
    this.get();
    setInterval(this.onGet, 5000);

    this.getStats();
  }

  get() {
    axios.get('actions/fathom-analytics/reports/realtime-widget').then((response) => {
      this.wrapper.innerHTML = response.data.Data;
    });
  }

  getStats() {
    // Set the after date
    this.setAfter();

    axios.get('actions/fathom-analytics/reports/site-stats', {
      params: {
        before: this.config.before.unix(),
        after: this.config.after.unix()
      },
    }).then((response) => {
      this.uniqueVisEl.innerHTML = response.data.Data.Visitors;
      this.pageviewsEl.innerHTML = response.data.Data.Pageviews;
      this.avgTimeEl.innerHTML = dayjs()
        .hour(0).minute(0).second(response.data.Data.AvgDuration)
        .millisecond(0)
        .format('mm:ss');
      this.bounceRateEl.innerHTML = `${parseInt(response.data.Data.BounceRate * 10, 10)}%`;
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
};
