import path from 'path';
import settings from '../../package.json';

const {
  dirClient,
  dirPublic
} = settings.boilerplate || {};

const config = {
  pathBase: path.resolve(__dirname, '../..'),
  dirClient: dirClient,
  dirPublic: dirPublic,

  serverPort: 3000,

  compilerFailOnWarning: false,
  compilerQuiet: false,
  compilerStats: {
    assets: true,
    colors: true,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    hash: false,
    modules: false,
    timings: false,
    versian: false,
    excludeAssets: [/fonts/, /img/]
  }
};

config.globals = {
  DEV: process.env.NODE_ENV === 'development',
  PROD: process.env.NODE_ENV === 'production',
  NODE_ENV: process.env.NODE_ENV,
  DEV_SERVER: process.env.DEV_SERVER === '1'
};

function base(...args) {
  return path.resolve(...[config.pathBase].concat([].slice.call(args)));
}

config.paths = {
  base,
  client: base.bind(null, config.dirClient),
  public: base.bind(null, config.dirPublic),
};

export default config;
