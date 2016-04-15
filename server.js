var express = require('express'), http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')
var location = [0, 0];

// This makes the static css and js files in the public directory visible to the client
app.use(express.static('public'));

// Parse json get request
app.use(bodyParser.json());

// Renders the index.html file in the view folder at the root url
app.get('/',function(req,res){
  res.sendFile(__dirname + '/views/index.html');
  console.log("Get Index.html");
});

// Sets up a socket to push colors and positions to the client at /draw
var drawSocket = io.of('/draw');
var videoSocket = io.of('/video');

// Get the data from the robot
app.post('/colorData', function(req, res) {
  console.log("Robot send data");
  console.log(req.body); // res.body is the json passed in the post request, should look like {color: ...., position: ...}

  drawSocket.emit('colorData', req.body);
  res.send(req.body); // just send the data back for testing
});

const spawn = require('child_process').spawn;
const tracker = spawn('python', ['-u', 'ball_tracking.py']);

img = 0;
tracker.stdout.on('data', (data) => {
  try {
    data = JSON.parse(data);
    if (data.x !== 'undefined') {
      location[0] = data.x
      location[1] = data.y
    }
  } catch(err) {

  }
});

tracker.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

tracker.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

tracker.on('message', function(message) {
  console.log('Received message...');
  console.log(message);
});


app.get('/location', function(req, res) {
  console.log("Robot get location");
  console.log(location);

  res.send(location); // just send the data back for testing
});

server.listen(8081, function () {
  var port = server.address().port
  console.log("Example app listening at http://localhost:%s", port)
})
