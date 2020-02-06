/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import Debug from 'debug';
/* eslint-enable import/no-extraneous-dependencies */
import webpackConfig from '../config/webpack.config';
import project from '../config/project.config';

const debug = Debug('webpack');

debug('Starting watch mode 👀');

webpack(webpackConfig).watch(100, (err, stats) => {
  if (err) {
    debug('Webpack compiler encountered a fatal error.', err);
  } else {
    debug(stats.toString(project.compilerStats));
  }
});
