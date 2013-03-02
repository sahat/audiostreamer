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

var socket = io.connect('http://localhost:3000');

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

