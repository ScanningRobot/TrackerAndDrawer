
// Sockets for video and getting data from the robot
// var videoSocket = io('/video');
var drawSocket = io('/draw');

// var vSocket = videoSocket.connect('http://192.168.1.20', {'force new connection': true});
var dSocket = drawSocket.connect('http://192.168.1.20', {'force new connection': true});

// var canvasVideo = document.getElementById('canvas-video');
// var context = canvasVideo.getContext('2d');
// var img = new Image();

// show loading notice
// context.fillStyle = '#333';
// context.fillText('Loading...', canvasVideo.width/2-30, canvasVideo.height/3);


// Live stream the video
// vSocket.on('frame', function (data) {
//   // Reference: http://stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e/24124966#24124966
//   var uint8Arr = new Uint8Array(data.buffer);
//   var str = String.fromCharCode.apply(null, uint8Arr);
//   var base64String = btoa(str);

//   img.onload = function () {
//     context.drawImage(this, 0, 0, canvasVideo.width, canvasVideo.height);
//   };
//   img.src = 'data:image/png;base64,' + base64String;

// });


// Draw the piture as the robot goes over it
dSocket.on('colorData', function (data) {
  console.log("Post Data");
  console.log(data);


  console.log(data.position);
  var x = data.position[0];
  var y = data.position[1];
  var color = data.color;

  console.log(x);
  console.log(y);
  console.log(color);

  var svgNS = "http://www.w3.org/2000/svg";

  var rect = document.createElementNS(svgNS, 'rect');
  rect.setAttributeNS(null, 'x', Math.round(x / 10) * 10);
  rect.setAttributeNS(null, 'y', Math.round(y / 10) * 10);
  rect.setAttributeNS(null, 'height', '10');
  rect.setAttributeNS(null, 'width', '10');
  rect.setAttributeNS(null, 'fill', color);
  rect.setAttributeNS(null,"stroke","none");
  document.getElementById('drawing').appendChild(rect);

});