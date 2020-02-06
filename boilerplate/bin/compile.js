/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import Debug from 'debug';
/* eslint-enable import/no-extraneous-dependencies */
import webpackConfig from '../config/webpack.config';
import project from '../config/project.config';

const debug = Debug('webpack');

// Wrapper around webpack to promisify its compiler and supply friendly logging
const webpackCompiler = () => new Promise((resolve, reject) => { // eslint-disable-line compat/compat
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      debug('Webpack compiler encountered a fatal error.', err);
      return reject(err);
    }

    const jsonStats = stats.toJson();
    debug('Webpack compile completed.');
    debug(stats.toString(project.compilerStats));

    if (jsonStats.errors.length > 0) {
      debug('Webpack compiler encountered errors.');
      debug(jsonStats.errors.join('\n'));
      return reject(new Error('Webpack compiler encountered errors'));
    }
    if (jsonStats.warnings.length > 0) {
      debug('Webpack compiler encountered warnings.');
      debug(jsonStats.warnings.join('\n'));
    } else {
      debug('No errors or warnings encountered.');
    }
    return resolve(jsonStats);
  });
});

const compile = () => {
  debug('Starting compiler.');
  return Promise.resolve() // eslint-disable-line compat/compat
    .then(() => webpackCompiler(webpackConfig))
    .then((stats) => {
      if (stats.warnings.length && project.compilerFailOnWarning) {
        throw new Error('Config set to fail on warning, exiting with status code "1".');
      }
      // debug('Copying static assets to dist folder.')
      // fs.copySync(project.paths.public(), project.paths.dist())
    })
    .then(() => {
      debug('Compilation completed successfully.');
    })
    .catch((err) => {
      debug('Compiler encountered an error.', err);
      process.exit(1);
    });
};

compile();
