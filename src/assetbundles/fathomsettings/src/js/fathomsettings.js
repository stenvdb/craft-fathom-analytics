import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';
import '../scss/fathomsettings.scss';

window.FathomAnalytics = {};
window.FathomAnalytics.Settings = class FathomSettings {
  constructor() {
    this.trackingTab = document.querySelector('.tab[id="tab-tracking"]');

    this.onTabClick = this.tabClick.bind(this);

    this.init();
  }

  init() {
    const { hash } = window.location;
    if (hash === '' || hash !== '#tracking') {
      this.addEvents();
    } else {
      this.inject();
    }
  }

  addEvents() {
    if (this.trackingTab) this.trackingTab.addEventListener('click', this.onTabClick);
  }

  tabClick() {
    this.trackingTab.removeEventListener('click', this.onTabClick);
    this.inject();
  }

  inject() {
    CodeMirror.fromTextArea(document.getElementById('trackingCode'), {
      indentUnit: 8,
      styleActiveLine: true,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'javascript',
      theme: 'default'
    });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  new window.FathomAnalytics.Settings();
});
