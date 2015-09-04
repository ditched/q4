var message = (function() {
  var methods = {};

  methods.console = function(io, user, message) {
    io.sockets.in(user).emit('console message', {
      message: message
    });
  }

  return methods;
})();

module.exports = message;