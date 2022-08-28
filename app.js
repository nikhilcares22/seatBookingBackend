const express = require('express');
const app = express();
const server = require("http").createServer(app);
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port =  3000;
const connection = require('./connection/connection');
const cronjobs = require('./api/cron/cronjobs');

const userRoutes = require('./api/routes/user');
const seatRoutes = require('./api/routes/seat');
const bookingRoutes = require('./api/routes/booking');

//morgan used for logging the requests
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,  POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//routes which should handle requests
app.use('/user', userRoutes);
app.use('/seat', seatRoutes);
app.use('/booking', bookingRoutes);


app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);

})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

server.listen(port, async () => {
    console.log(`Running on:`, port);

    connection.mongodb();
    cronjobs.everyMinute();
});

module.exports = app;