import Debug from 'debug';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import purgecss from '@fullhuman/postcss-purgecss';
import ManifestPlugin from 'webpack-manifest-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';
import normalize from 'postcss-normalize';
import project from './project.config';

const { DEV, PROD, DEV_SERVER } = project.globals;
const debug = Debug('webpack');

// Hide irritating deprecation warnings from Webpack loaders, see https://github.com/webpack/loader-utils/issues/56#issuecomment-281967053
process.noDeprecation = true;

debug('Creating Webpack configuration.');

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || []; // eslint-disable-line
  }
}

/*
 * Create a custom little plugin to add the craft templates folder
 * when saving any template, it will retrigger a compile
 */
const WatchExternalFilesPlugin = () => {
  WatchExternalFilesPlugin.prototype.apply = (compiler) => {
    compiler.plugin('after-compile', (compilation, callback) => {
      compilation.contextDependencies.add(project.paths.base('./templates'));
      callback();
    });
  };
};

const svgoLoader = {
  loader: 'svgo-loader',
  options: {
    plugins: [
      {
        cleanupIDs: {
          remove: false,
          prefix: Math.random().toString(36).substring(7),
          minify: true,
        }
      },
      { removeTitle: true },
      { removeDimensions: true }
    ]
  }
};

const postcssPlugins = [
  normalize(),
  tailwindcss(),
  autoprefixer({
    grid: true
  })
];

if (PROD) {
  postcssPlugins.push(purgecss({
    content: ['src/templates/_components/widgets/**/*.{html,twig}'],
    extractors: [
      {
        extractor: TailwindExtractor,
        extensions: ['twig', 'html']
      }
    ]
  }));
  postcssPlugins.push(cssnano({
    preset: 'default'
  }));
}

const webpackConfig = {
  mode: DEV ? 'development' : 'production',
  devtool: 'eval-source-map',
  context: project.paths.client(),
  entry: {
    fathomanalytics: ['./fathomanalytics/src/js/fathomanalytics.js'],
    statisticswidget: ['./statisticswidget/src/js/statisticswidget.js'],
    reportwidget: ['./reportwidget/src/js/reportwidget.js'],
    toppageswidget: ['./toppageswidget/src/js/toppageswidget.js']
  },
  output: {
    path: project.paths.public(''),
    publicPath: '/',
    filename: (DEV) ? '[name]/dist/js/[name].js' : '[name]/dist/js/[name].min.js'
  },
  resolve: {
    modules: [
      project.paths.client(),
      'node_modules'
    ],
    extensions: ['*', '.js', '.jsx', '.json'],
    alias: {
      'pixi.js': 'pixi.js/dist/pixi.min.js',
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        include: project.paths.client('js'),
        use: [{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: postcssPlugins
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [
                project.paths.client('scss')
              ],
            },
          },
        ]
      },
      {
        /*
         * This is for image files
         * We don't want to load these files or inline them, just leave the relative link as is
         * Simply run all images through an optimizer and copy them
         */
        test: /\.(png|jpg)/,
        use: [{
          loader: 'file-loader',
          options: {
            emitFile: true,
            name: 'img/[name].[ext]',
          }
        }]
      },
      {
        test: /\.svg$/,
        include: /inline-svg/,
        exclude: /sprite-svg/,
        use: [
          {
            loader: 'svg-url-loader',
          },
          svgoLoader
        ]
      },
      {
        test: /\.svg$/,
        exclude: /inline-svg/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'img/sprite-svg/sprite.svg'
            }
          },
          svgoLoader
        ]
      },
      {
        // Fonts
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          name: 'fonts/[name].[ext]',
          limit: 10000
        },
      },
      {
        test: /\.(html|twig)$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(project.globals)
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new SpriteLoaderPlugin(),
    new ManifestPlugin({
      writeToFileEmit: true,
      filter: ({ isAsset }) => !isAsset
    }),
    new CleanWebpackPlugin([
      'js',
      'css',
      'fonts'
    ], {
      root: project.paths.public('assets'),
      watch: false,
      verbose: false,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      filename: (DEV) ? '[name]/dist/css/[name].css' : '[name]/dist/css/[name].min.css'
    }),
    new StyleLintPlugin(),
  ]
};

if (DEV_SERVER) {
  webpackConfig.plugins.push(new WatchExternalFilesPlugin());
}

module.exports = webpackConfig;
