Person = Backbone.Model.extend({
  defaults: { name: 'Sahat' },
  initialize: function() {
    this.on('change:name', function(model) {
      console.log('name property has been changed to' + 
                  model.get('name'));
    });
    console.log("Welcome to this world");
  }
});    

var person = new Person();

var socket = io.connect('http://seniorproject.herokuapp.com');

socket.on('this', function(data) {
  console.log(data);
})

socket.on('start', function(data) {
  console.log(data);
  $('audio').get(0).play();
});

socket.on('now', function(data) {
  console.log(data);
});

$(function() {
  var foo = document.getElementById('player');
  $('#pause').click( function() {
    $('audio').get(0).pause();
  });


  $('#play').click( function() {
    socket.emit('play', 'start emit has been triggered');
  });
});

function enableAudio(element, audio, onEnd){
  var callback = false,
    click    = false;

  click = function(e){
    var forceStop = function () {
        audio.removeEventListener('play', forceStop, false);
        audio.pause();
        element.removeEventListener('touchstart', click, false);
        if(onEnd) onEnd();
      },
      progress  = function () {
        audio.removeEventListener('canplaythrough', progress, false);
        if (callback) callback();
      };

    audio.addEventListener('play', forceStop, false);
    audio.addEventListener('canplaythrough', progress, false);
    try {
      audio.play();
    } catch (e) {
      callback = function () {
        callback = false;
        audio.play();
      };
    }
  };
  element.addEventListener('touchstart', click, false);
}

enableAudio($('#music'),audio);

