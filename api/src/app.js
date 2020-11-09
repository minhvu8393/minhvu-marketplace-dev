const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routers/user');
const postRouter = require('./routers/post');
const uploadRouter = require('./routers/upload');
const port = process.env.PORT;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const path = require('path');
require('./db/db');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(userRouter);
app.use(postRouter);
app.use(uploadRouter);

const httpsApi = https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert')
}, app)

httpsApi.listen(process.env.PORT);
console.log('Server start at port', port);