const path = require('path');
const webpack = require('webpack');
// const HtmlWebPackPlugin = require("html-webpack-plugin");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// const port = process.env.PORT || '8080';

module.exports = env => {
    const mode = env && env.mode || 'development';
    console.log(' ');
    console.log('Bundling for ' + mode + ' mode...');

    return {
        context: __dirname,
        entry: {
            index: ['babel-polyfill', './src/index.js'],
            css: './src/css/App.css',
            service: './src/server/service.js'
        },
        target: 'electron-main',
        // target: 'node',
        mode: mode,
        output: {
            filename: '[name].js',
            path: __dirname + '/public/',
            publicPath: __dirname + '/public/',// <> ---------- here
        },
        node: {
            __dirname: false,
            __filename: false
          },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    // exclude: /(node_modules)/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' },
                        {
                            loader: 'sass-loader',
                        },
                    ],
                },
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', 'es2015']
                        }
                    }
                },
                {
                    test: /\.(gif|png|jp(e*)g|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: "./images"
                                // outputPath: path.resolve(".","public\/images")
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                name: '[name].[ext]',
                                useRelativePath: true,
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4
                                },
                            }
                            // options: {
                            //     pngquant: {
                            //         quality: '65-90',
                            //         speed: 4
                            //     },
                            //     bypassOnDebug: true,
                            //     disable: true,
                            // },
                        },
                    ]
                }
            ]
        },
        externals: [
            'ws',
            'dotenv',
            // 'node_modules'
        ],
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            // new HtmlWebpackPlugin()
            // new MiniCssExtractPlugin({
            //   filename: "[name].css",
            //   chunkFilename: "[id].css"
            // })

        ],
        devtool: mode == 'development' ? '#source-map' : '',
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            host: 'localhost',
            port: 3000,
            stats: 'errors-only',
        },
        resolve: {
            modules: [
                path.resolve(__dirname, "src"),
                "node_modules"
            ],
            extensions: ['.jsx', '.js', '.css','.json'],
        }
    }
};
