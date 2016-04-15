var path = require('path');


module.exports = {
    entry: {
        demo: path.join(__dirname, 'src/dist.js')
    },
    output: {
        filename: 'dist/beemirror.js'
    },
    module: {
        loaders: [
            {test: /\.json?$/, loader: 'json'},
            {test: /\.js?$/, exclude: /node_modules/, loader: 'babel'},
            {test: /\.js?$/, include: /prosemirror/, loader: 'babel'}
        ]
    }
};
