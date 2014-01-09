if (window.location.hostname === 'localhost') {
  var socket = io.connect('http://localhost');
} else {
  var socket = io.connect('ws://seniorproject.herokuapp.com');
}
var latency;


setInterval(function() {
  var startTime = Date.now();
  socket.emit('ping');
  socket.on('pong', function() {
    latency = Date.now() - startTime;
    $('#ping').text(latency);
  });
}, 500);

//$('#play').click(function () {
//  socket.emit('play', 'start emit has been triggered');
//  var ping = new Date();
//  socket.emit('current_time', ping);
//  socket.on('now', function (data) {
//    var newdate = new Date();
//    // global variable latency
//    latency = newdate - ping;
//    console.log(newdate, ping);
//    console.log(latency);
//  });
//});
$('#pause').click(function () {
  socket.emit('pause', 'pause the music  for everyone');
});


socket.on('count', function (data) {
  $('#numberOfClients').text(data.numberOfClients);
});

socket.on('beginPlaying', function (data) {
  var audio = $('#' + data.track.id + ' audio')[0];
  audio.autobuffer = true;
  setTimeout(function() {
    audio.play();
  }, latency)
});

socket.on('halt', function (data) {
  $.each($('audio'), function () {
    this.pause();
  });
});




$(function () {
  $.get('/tracks', function (data) {

    var source = $('#playlist-template').html();
    var template = Handlebars.compile(source);
    var tracks = { tracks: data };

    $('#playlist').append(template(tracks));

    $('.track').dblclick(function () {

      $('.highlight').removeClass('highlight');
      $(this).addClass('highlight');

      socket.emit('pause', 'pause everything else');

      socket.emit('initiatePlay', {
        timestamp: (new Date).getTime(),
        track: {
          id: $(this).attr('id'),
          title: $('.title', this).text(),
          artist: $('.artist', this).text()
        }
      });
    });
  });
});
