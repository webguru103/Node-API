var express = require('express');
var https = require("https");
var http = require("http");
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var q = require("bluebird");
var fs = require("fs");
var gm = require('gm').subClass({ imageMagick: true });
var app = express();

var port = normalizePort('5000');
app.set("port", port);

var privateKey = fs.readFileSync(path.join(__dirname) + '/keys/ca.key');
var certificate = fs.readFileSync(path.join(__dirname) + '/keys/ca.crt');
var server = https.createServer({
    key: privateKey,
    cert: certificate
}, app);
// var io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public') + '/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({
    storage: storage
}).single('file');

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.status(500).json({ error_code: 1, err_desc: err });
            return;
        }
        var filePath = req.file.path;
        res.status(200).json({
            file: filePath
        })
    })
});

app.post('/upload_with_small', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.status(500).json({ error_code: 1, err_desc: err });
            return;
        }
        var filePath = req.file.path;
        gm(filePath)
            .resize(16, 16)
            .write(filePath + ".small.png", function (err) {
                if (!err) {
                    res.status(200).json({
                        file: filePath,
                        file_small: filePath + ".small.png"
                    });
                } else {
                    res.status(500).json({ error_code: 1, err_desc: err });
                };
            });
    })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.sendFile(__dirname + '/public/src/app/views/page_404.html');
});

server.listen(4000);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}