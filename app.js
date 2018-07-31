var http = require('http'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        express = require('express');

var app = new express();
var server = http.createServer(app).listen(8000);

var io = require('socket.io').listen(server);

app.use(bodyParser.json({limit: '50mb'}));

io.on('connection', function(socket){
    socket.on('room', function(id){
        socket.join(id)
        console.log(`${this.id} join room ${id}`)
    })
})

var lastts = 0;
var ts = 0;
app.post('/engineInfo', function (req, res) {
    console.log(req.body);
    
    ts = req.body.timestamp;
    if (ts-lastts >= 0) {
        // console.log("ok");
    }
    else {
        console.log("error: ");
        console.log(ts);
        console.log(ts-lastts);
    }
    lastts = req.body.timestamp;
    console.log(req.body);
    // console.log(req.body.face_id);
    parserEngineInfo(req.body);

    var msgout = {};
    msgout = {error: 0, message: 'success!'};
    res.json(msgout);
});

function parserEngineInfo(engineInfo) {
    io.sockets.in(engineInfo.camera_id).emit('engineInfo', engineInfo)
    // io.emit('engineInfo', engineInfo);
}