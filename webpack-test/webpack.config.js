const HtmlWebpackPlugin = require("html-webpack-plugin")
const { resolve } = require("path")

module.exports = {
  mode: "development",
  entry: resolve(__dirname, "./src/app.js"),
  output: {
    path: resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  resolveLoader: {
    modules: ["node_modules", resolve(__dirname, "loaders")],
  },
  module: {
    rules: [
      {
        test: /\.tpl$/,
        use: [
          "babel-loader",
          {
            loader: "tpl-loader",
            options: {
              log: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "index.html"),
    }),
  ],
}
