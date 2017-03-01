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
            {test: /\.json?$/, loader: 'json-loader'},
            {
                test: /\.js?$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader',
                query: {
                    presets: ['es2015',  'stage-0']
                }
            },
            {test: /\.js?$/, include: /prosemirror/, loader: 'babel-loader'}
        ]
    }
};
