const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
    join,
    resolve
} = require('path');



if (1 ==1) {
    require("./socketIO-server/server.js");
}

module.exports = {
    entry: "./www/js/Portal.js", //"./www/js/Main.js",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./www/index.html" //./www/index.html
        }),
        new CopyWebpackPlugin([{
            from: "./www/assets",
            to: "assets"
        }])
    ],
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                    loader: "style-loader"
                },
                {
                    loader: "css-loader"
                }
            ]
        }]
    },
    node: {
        fs: 'empty'
    }
}