const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');


const mode = process.env.NODE_ENV;
const isDev = mode === 'development';


const filename = ext => isDev ?
    `[name].${ext}` :
    `[name].[fullhash].${ext}`

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (!isDev) {
        config.minimizer = [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    }

    return config;
}

const generateHTML = fileName => {
    return {  // Also generate a other html
        filename: `./pages/${fileName}.html`,
        template: `./pages/${fileName}.html`,
        publicPath: '../',
        minify: {
            collapseWhitespace: false
        }
    }


}

module.exports = {
    context: path.resolve(__dirname, 'src'),  // указание на папку исходных файлов
    entry: {
        main: ['@babel/polyfill', './js/index.js']  // With babel
        //main: './js/index.js'
    },
    output: {
        filename: `js/${filename('js')}`,
        path: path.resolve(__dirname, 'build'),
        environment: {
            arrowFunction: false,
        },
    },
    mode,
    resolve: {
        extensions: ['.js', '.css', '.scss', '.json', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [
		new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: false
            }
		}),
        new HtmlWebpackPlugin(generateHTML('promo')), // Генерация доп страниц HTML
        new HtmlWebpackPlugin(generateHTML('new')),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `css/${filename('css')}`
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'build')
                },
                {
                    from: "fonts/**",
                    to: path.resolve(__dirname, 'build')
                },
            ]
        }),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                plugins: [
                    // Lossless optimization (оптимизация БЕЗ потери качества jpg/png)
                    // ['gifsicle', { interlaced: true }],
                    // ['jpegtran', { progressive: true }],
                    // ['optipng', { optimizationLevel: 5 }],
                    // ['svgo', { plugins: [{ removeViewBox: false }] }],

                    // Lossy optimization (оптимизация С потерей качества jpg/png)
                    ['gifsicle', { interlaced: true }],
                    ['mozjpeg', { quality: 95 }],
                    ['pngquant', [0.5, 0.5]],
                    //['svgo', { plugins: [{ removeViewBox: false }] }],
                    ['webp', {quality: 50}]
                ],
            },
        }),

    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: { url: false, importLoaders: 1 }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                          postcssOptions: {
                            plugins: [
                                [
                                  "postcss-preset-env",
                                  {
                                    // Options
                                    browsers: 'last 5 versions',
                                    autoprefixer: { grid: true }
                                  },
                                ],
                            ],
                          },
                        },
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|svg|gif|webp)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],

            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
            // {
            //     test: /\.html$/,
            //     loader: 'html-loader',

            // },

        ]
    },
    optimization: optimization(),
    devServer: {
        watchFiles: ['src/**/*'],
        port: 8080,  // порт
        open: true,  // открывать браузер при запуске
        hot: true,  // при добавлении новых модулей сразу их подключать
        compress: true,  // gzip компрессия
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
            progress: true,
        },  // оверлей при ошибках
        devMiddleware: {
            writeToDisk: false, // записывать файлы в папку build
          },
        historyApiFallback: true,  // использование history HTML5

    },
    devtool: isDev && 'source-map'
}
