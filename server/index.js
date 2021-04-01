const path = require('path');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const PORT = process.env.PORT || 8080;
const app = express();
//const socketio = require('socket.io');
module.exports = app;

//logging middleware
app.use(morgan('dev'));

//body parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//compression middleware
app.use(compression());

//static file-seriving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

//error handler
app.use((req, res, next) => {
    if(path.extname(req.path).length) {
        const err = new Error('Not found');
        err.status = 404;
        next(err);
    } else {
        next();
    }
});

//sends index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

//error handling endware
app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.listen(PORT, () => 
    console.log(`Listening to beets on port ${PORT}`));

// const io = socketio(server);
//require('./socket')(io);

