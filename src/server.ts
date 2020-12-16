import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';

import sampleRoutes from './routes/sample';

const NAMESPACE = 'Server';
const router = express();

//Logging the request
router.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATS - [${res.statusCode}]`);
    });
    next();
});

/* PARSE THE REQUEST */
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/** RULES OF API */

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE PORT PUT');
        return res.status(200).json({});
    }
    next();
});

/* Routes */
router.use('/sample', sampleRoutes);

/* Error Handling */
router.use((req, res, next) => {
    const error = new Error('not found');

    return res.status(404).json({
        message: error.message
    });
});

/* create server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running on ${config.server.hostname}:${config.server.port}`));
