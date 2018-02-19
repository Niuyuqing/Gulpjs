var webpack = require('webpack');
var glob = require('glob');
var debug = true;

function getEntry() {
	var entry = {};
	glob.sync(__dirname + "/app/js/*.js").forEach(function(file) {
		var name = file.match(/([^/]+?)\.js/)[1];
		entry[name] = __dirname + "/app/js/" + name + ".js";
	});
	return entry;
}
//used while add min ext
function getExt() {
	return debug ? ".min.js" : "js";
}
module.exports = {
	// context: __dirname + "/app/",
	entry: getEntry(),
	devtool: 'source-map',
	externals: {
		jquery: 'window.$'
	},
	output: {
		path: __dirname + '/build/js',
		filename: '[name].js', // + getExt(),
		sourceMapFilename: '[file].map'
	},
	module: {
		noParse: [],
		loaders: [{
				test: /\.jsx?$/,
				loader: 'babel',
			},
			{
				test: /\.less$/,
				loader: 'style!css!less',
				options: {
					modules: true,
					localIdentName: '[path][name]__[local]--[hash:base64:5]'
				}

			}
		]
	},
	debug: debug
};