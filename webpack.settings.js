require('dotenv').config();

module.exports = {
    name: 'Groots 2',
    paths: {
        src: {
            base: './src/',
            css: './src/css/',
            js: './src/js/',
        },
        dist: {
            base: './public/dist/',
            clean: ['./img', './css', './js'],
        },
    },
    urls: {
        publicPath: "./public/",
    },
    entries: {
        main: 'main.js',
        groots: 'groots.js',
    },
    devServerConfig: {
        public: () => process.env.DEVSERVER_PUBLIC || 'http://localhost:8080',
        host: () => process.env.DEVSERVER_HOST || 'localhost',
        poll: () => process.env.DEVSERVER_POLL || false,
        port: () => process.env.DEVSERVER_PORT || 8080,
        https: () => process.env.DEVSERVER_HTTPS || false,
    },
    manifestConfig: {
        basePath: ""
    },
};
