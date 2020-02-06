/* eslint-disable import/no-extraneous-dependencies */
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import Debug from 'debug';
/* eslint-enable import/no-extraneous-dependencies */
import webpackConfig from '../config/webpack.config';
import project from '../config/project.config';

const debug = Debug('webpack');

// Add the webpack-dev-server client entry point to all entry points
webpackConfig.entry.app.unshift(`webpack-dev-server/client?http://localhost:${project.serverPort}`);

debug('Starting webpack compiler');
// Start Webpack
const compiler = webpack(webpackConfig);

// Pass compiler along to the webpack-dev-server
const server = new WebpackDevServer(compiler, {
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  publicPath: '//localhost:3000/assets/',
  disableHostCheck: true,
  contentBase: './www',
  https: false,
  sockHost: 'localhost',
  sockPort: 3000,
  quiet: project.compilerQuiet,
  noInfo: project.compilerQuiet,
  stats: project.compilerStats
});

export default server;
