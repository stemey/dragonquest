var path = require("path");
var webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/main.ts",
    mode: "development",
    target: "web",
    devtool: "inline-source-map",
    watchOptions: {
        poll: true,
        ignored: /node_modules/,
    },
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true),
        }),
        new HtmlWebpackPlugin({
            title: "Phaser Game",
            template: path.resolve(__dirname, "index.html"),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "assets", "**/*"),

                    to: path.resolve(__dirname, "dist"),
                },
                {
                    from: path.resolve(__dirname, "generated/config", "**/*"),

                    to: path.resolve(__dirname, "dist"),
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["ts-loader"],
                include: path.join(__dirname, "src"),
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        port: 3000,
        hot: true,
    },
};
