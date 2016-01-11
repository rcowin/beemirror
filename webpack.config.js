var path = require('path');


module.exports = {
    entry: {
        demo: path.join(__dirname, 'demo/demo.js')
    },
    output: {
        filename: 'demo/demo-built.js'
    },
    module: {
        loaders: [
            {test: /\.json?$/, loader: 'json'},
            {test: /\.js?$/, exclude: /node_modules/, loader: 'babel'},
            {test: /\.js?$/, include: /prosemirror/, loader: 'babel'}
        ]
    }
};