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

$('#play').click(function() {
  socket.emit('play', 'start emit has been triggered');
});
$('#pause').click(function() {
  socket.emit('pause', 'pause the music  for everyone');
});


//var socket = io.connect('http://seniorproject.herokuapp.com');
var socket = io.connect('http://localhost');


socket.on('this', function(data) {
  console.log(data);
})

socket.on('count', function(data) {
  $('#numberOfClients').text(data.numberOfClients);
});

socket.on('start', function(data) {
  console.log(data);
  $('audio').get(0).play();
});

socket.on('halt', function(data) {
  console.log(data);
  $('audio').get(0).pause();
});

socket.on('now', function(data) {
  console.log(data);
});


$.get('/clients', function(data) {
  console.log('ajax get data:', data);
  var templateData = {
    numberOfClients: data
  }
  console.log('template data:', templateData);
  var templateMarkup = $("#clients-template" ).html();
  var template = _.template(templateMarkup, templateData);
  $("#oauth").prepend(template);
});
