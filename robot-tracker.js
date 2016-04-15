var cv = require('opencv');
var extend = require('extend');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 30;
var camInterval = 1000 / camFps;

// Lower and upper bondaries of color green
const greenLower = [29, 86, 6]
const greenUpper = [64, 255, 255]

var robotLocation = null;

// initialize camera
var camera;

try {
  console.log("Trying to open second webcam");
  camera = new cv.VideoCapture(1);
  console.log("Successfully started second webcam");
} catch (error) {
  console.log("Failed to open second webcam, trying to open first one");
  camera = new cv.VideoCapture(0);
  console.log("Successfully started first webcam")
}

camera.setWidth(camWidth);
camera.setHeight(camHeight);


// When video starts streaming, we start keeping track of the robot
var StreamVideo = function (io) {
  console.log('Image processing started.')
  var videoSocket = io.of('/video');

  setInterval(function() {
    setTimeout(function() {
      camera.read(function(err, image) {
        if (err) throw err;

        var frame = image.copy();

        frame.convertHSVscale();                  // convert to HSV
        frame.inRange(greenLower, greenUpper);    // filter colors

        var contours = frame.findContours();

        // Count of contours in the Contours object
        var size = contours.size();

        // Send volatile data to namespace -> http://stackoverflow.com/questions/25265860/socketio-volatile-emit-to-namespace
        // volatile means the packets will be dropped if no one is there to recieve them, or if they are not recieved fast enough
        // that way the socket does not get backed up causing the video to be really delayed. if frames are dropped, oh well, who cares
        Object.keys(io.nsps['/video'].connected).forEach(function(socketID) {
            io.nsps['/video'].connected[socketID].volatile.emit('frame', { buffer: image.toBuffer() , buffer2: frame.toBuffer()});
        });

      });
    }, camInterval-100); // this makes sure the main thread will never be blocked
  }, camInterval);
};
module.exports.StreamVideo = StreamVideo;

var GetLocation = function () {
  return robotLocation;
};
module.exports.GetLocation = GetLocation;
