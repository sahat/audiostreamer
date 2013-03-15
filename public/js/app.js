/*
$(function() {
  var Song = Backbone.Model.extend({
    defaults: {
      filename: 'Not specified',
      title: 'Not specified',
      duration: 'Not specified',
      artist: 'Not specified',
      album: 'Not specified',
      genre: 'Not specified'
    },
    initialize: function() {
      console.log('New song has been initialized');
    }
  });

  var Playlist = Backbone.Collection.extend({
    model: Song,
    url: '/tracks'
 });

  var song1 = new Song({
    filename: 'eminem-till_i_collapse',
    title: 'Till I Collapse',
    duration: '4:57',
    artist: 'Eminem',
    album: 'The Eminem Show',
    genre: 'Rap'
  });
  var song2 = new Song({
    filename: 'withintemptation-stand_my_ground',
    title: 'Stand My Ground',
    duration: '4:28',
    artist: 'Within Temptation',
    album: 'Silent Force',
    genre: 'Symphonic Metal'
  });
  var song3 = new Song({
    filename: 'evanescence-lithium',
    title: 'Lithium',
    duration: '3:44',
    artist: 'Evanescence',
    album: 'The Open Door',
    genre: 'Rock'
  });
  var song4 = new Song({
    filename: 'tiesto-just_be',
    title: 'Just Be',
    duration: '3:11',
    artist: 'Tiesto',
    album: 'Just Be',
    genre: 'Techno'
  });
  var song5 = new Song({
    filename: 'apocalyptica-bring_them_to_light',
    title: 'Bring Them To Light',
    duration: '4:42',
    artist: 'Apocalyptica',
    album: '7th Symphony',
    genre: 'Metal'
  });

  var myPlaylist = new Playlist([song1, song2, song3, song4, song5]);

  var PlaylistView = Backbone.View.extend({
    tagName: 'tr',
    className: 'track',
    template: _.template($('track-template').html()),
    events: {
      'dblclick .track': 'playTrack'
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    pause: function() {
      this.$el.toggleClass('alert-info');
    },
    play: function() {

    }
  });

});
*/



$('#play').click(function() {
  socket.emit('play', 'start emit has been triggered');
  var ping = new Date();
  socket.emit('current_time', ping);
  socket.on('now', function(data) {
    newdate = new Date();
    // global variable latency
    latency = newdate - ping;
    console.log(newdate, ping);
    console.log(latency);
  });
  });
$('#pause').click(function() {
  socket.emit('pause', 'pause the music  for everyone');
});

if (window.location.hostname === 'localhost') {
  var socket = io.connect('http://localhost');
} else {
  var socket = io.connect('http://seniorproject.herokuapp.com');
}

socket.on('count', function(data) {
  $('#numberOfClients').text(data.numberOfClients);
});

socket.on('start', function(data) {
  console.log(data);
  var audio = $('#'+data.track.id+' audio').get(0);
  audio.autobuffer = true;
  audio.currentTime(latency/2);
  audio.play();
});

socket.on('halt', function(data) {
  console.log(data);
  $.each($('audio'), function () {
    this.pause();
  });
});





$(function() {
  $.get('/tracks', function(data) {
    var source = $('#playlist-template').html();
    var template = Handlebars.compile(source);
    var tracks = { tracks: data };
    $('#playlist').append(template(tracks));

    $('.track').dblclick(function() {
      $('.highlight').removeClass('highlight');
      $(this).addClass('highlight');

      socket.emit('pause', 'pause everything else');

      socket.emit('play', { track: {
        id: $(this).attr('id'),
        title: $('.title', this).text(),
    artist: $('.artist', this).text()
  }});

});
  });
});
