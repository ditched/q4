var options = {
  socket_port: 3000,
  prefix: '[Q4] ',
}

var 
  io = require('socket.io').listen(options.socket_port),
  underscore = require('underscore'),
  colors = require('colors/safe'),
  banMan = require('./library/utils/banned'),
  message = require('./library/utils/message'),
  filter = require('profanity-filter'),
  prefix = colors.yellow(options.prefix);

var clients = {};
var banned = [];

console.log(prefix + 'Running!');

io.on('connection', function(socket) {
  console.log(prefix + socket.request.connection.remoteAddress + ' handshake established');
  for(var k in banned) {
    if(banMan.isBanned(clients, k)) {
      message.console(k, 'You are banned!');
      socket.disconnect();
    }
  }
  socket.on('establish', function(d) {
    if(!d.payload) return;
    socket.join(d.username);
    clients[d.username] = '';
    clients[d.username]['username'] = d.username;
    io.emit('update users', clients);
    socket.on('disconnect', function() {
      for(var user in clients) {
        if(clients.hasOwnProperty(user)) {
          console.log(user);
        }
      }
      delete clients[d.username];
      io.emit('update users', clients);
    });
  });
  socket.on('chat message', function(username, message) {
    var unswear = filter.clean(message);
    var newStr = (function(str) {
      var syntaxMap = [
        {
          match: /</g,
          replace: '&lt;'
        }, {
          match: />/g,
          replace: '&gt;'
        },

        {
          match: /_(.+)_/g,
          replace: '<i class="parser">$1</i>'
        }, {
          match: /\*(.+)\*/g,
          replace: '<b class="parser">$1</b>'
        }, {
          match: /`(.+)`/g,
          replace: '<pre><code>$1</code></pre>'
        }
      ];

      var processedStr = str;
      syntaxMap.forEach(function(item) {
        processedStr = processedStr.replace(item.match, item.replace);
      });

      return processedStr;
    }(unswear));
    if(newStr[0] === '/') {
      var command = newStr.match(/^\/(.+?)(?:\ (.+))?$/);
      var cmdName = command[1];
      var args = command[2] || null;

      //if()
    }
  });
});