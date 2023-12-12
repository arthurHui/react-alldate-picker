var path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        path: path.resolve("dist"),
        filename: "index.js",
        libraryTarget: "commonjs2"
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader" },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    externals: {
        react: "react"
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    }
};