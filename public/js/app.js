/*
$(function() {
  var Track = Backbone.Model.extend({

    defaults: function() {

    },

    initialize: function() {

    }

  });

  var TrackList = Backbone.Collection.extend({

    url: '/tracks',

    model: Track

  });

  var Tracks = new TrackList;
  Tracks.fetch();

  var TrackView = Backbone.View.extend({

    tagName: 'tr',

    className: 'track',

    template: _.template($('track-template').html()),

    events: {
      'click .track': 'toggleSelection',
      'dblclick .track': 'playTrack'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    toggleSelection: function() {
      this.$el.toggleClass('alert-info');
    },

    playTrack: function() {

    }

  });

});
*/



$('#play').click(function() {
  socket.emit('play', 'start emit has been triggered');
});
$('#pause').click(function() {
  socket.emit('pause', 'pause the music  for everyone');
});

if (window.location.hostname === 'localhost') {
  var socket = io.connect('http://localhost');
} else {
  var socket = io.connect('http://seniorproject.herokuapp.com');
}


socket.on('this', function(data) {
  console.log(data);
});

socket.on('count', function(data) {
  $('#numberOfClients').text(data.numberOfClients);
});

socket.on('start', function(data) {
  console.log(data);
  $('#'+data.track.id+' audio').get(0).play();
});

socket.on('halt', function(data) {
  console.log(data);
  $.each($('audio'), function () {
    this.pause();
  });
});

socket.on('now', function(data) {
  console.log(data);
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
